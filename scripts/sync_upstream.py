#!/usr/bin/env python3
"""Sync Doom-addon providers from Doom-plug.

Doom-plug is the source of truth for provider files and provider metadata.
This script copies those providers into Doom-addon, then applies the small
add-on-specific adjustments needed for hosted Stremio use.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.request
from datetime import date, datetime, timezone
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
PROVIDER_REGISTRY_PATH = REPO_ROOT / "providers.json"
STREMIO_MANIFEST_PATH = REPO_ROOT / "manifest.json"
PACKAGE_PATH = REPO_ROOT / "package.json"
PROVIDERS_DIR = REPO_ROOT / "providers"
ANCHOR_DATE = date(2026, 4, 20)
CADENCE_DAYS = 2
DOOM_PLUG_RAW_BASE = os.environ.get(
    "DOOM_PLUG_RAW_BASE",
    "https://raw.githubusercontent.com/ummarm/Doom-plug/main",
).rstrip("/")
DOOM_PLUG_LOCAL_PATH = os.environ.get("DOOM_PLUG_LOCAL_PATH")
ADDON_DOMAINS_URL = "https://raw.githubusercontent.com/ummarm/Doom-addon/main/domains.json"
USER_AGENT = "Doom-addon Doom-plug sync"


def write_output(name: str, value: str) -> None:
    github_output = os.environ.get("GITHUB_OUTPUT")
    if not github_output:
        return
    with open(github_output, "a", encoding="utf-8") as fh:
        fh.write(f"{name}={value}\n")


def write_summary(lines: list[str]) -> None:
    summary_path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_path:
        return
    with open(summary_path, "a", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")


def fetch_text(path: str) -> str:
    if DOOM_PLUG_LOCAL_PATH:
        return (Path(DOOM_PLUG_LOCAL_PATH) / path).read_text(encoding="utf-8")

    request = urllib.request.Request(
        f"{DOOM_PLUG_RAW_BASE}/{path}",
        headers={"User-Agent": USER_AGENT},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8")


def load_source_manifest() -> dict:
    return json.loads(fetch_text("manifest.json"))


def write_json_if_changed(path: Path, payload: dict) -> bool:
    next_text = json.dumps(payload, indent=2) + "\n"
    current_text = path.read_text(encoding="utf-8") if path.exists() else ""
    if current_text == next_text:
        return False
    path.write_text(next_text, encoding="utf-8")
    return True


def write_text_if_changed(path: Path, text: str) -> bool:
    text = text.rstrip("\n") + "\n"
    current_text = path.read_text(encoding="utf-8") if path.exists() else ""
    if current_text == text:
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    return True


def transform_provider_source(text: str) -> str:
    text = re.sub(
        r"""((?:var|const|let)\s+DOMAINS_URL\s*=\s*)["'][^"']+["'];""",
        rf'\1"{ADDON_DOMAINS_URL}";',
        text,
        count=1,
    )
    return "\n".join(line.rstrip() for line in text.rstrip("\n").splitlines()) + "\n"


def addon_description(provider_names: list[str]) -> str:
    return (
        "A Stremio stream add-on wrapping the Doom-addon provider set: "
        + ", ".join(provider_names)
        + "."
    )


def package_description(provider_names: list[str]) -> str:
    return "Doom-addon: a Stremio stream add-on with " + ", ".join(provider_names) + "."


def update_registry(source_manifest: dict) -> bool:
    registry = dict(source_manifest)
    registry["name"] = "Doom-addon"
    return write_json_if_changed(PROVIDER_REGISTRY_PATH, registry)


def update_stremio_manifest(source_manifest: dict) -> bool:
    stremio_manifest = json.loads(STREMIO_MANIFEST_PATH.read_text(encoding="utf-8"))
    provider_names = [scraper["name"] for scraper in source_manifest.get("scrapers", [])]
    stremio_manifest["version"] = source_manifest["version"]
    stremio_manifest["name"] = "Doom-addon"
    stremio_manifest["description"] = addon_description(provider_names)
    return write_json_if_changed(STREMIO_MANIFEST_PATH, stremio_manifest)


def update_package(source_manifest: dict) -> bool:
    package_json = json.loads(PACKAGE_PATH.read_text(encoding="utf-8"))
    provider_names = [scraper["name"] for scraper in source_manifest.get("scrapers", [])]
    package_json["version"] = source_manifest["version"]
    package_json["description"] = package_description(provider_names)
    return write_json_if_changed(PACKAGE_PATH, package_json)


def sync_provider_files(source_manifest: dict) -> tuple[bool, list[str]]:
    changed = False
    changed_files: list[str] = []
    next_provider_paths = {
        scraper["filename"]
        for scraper in source_manifest.get("scrapers", [])
        if scraper.get("enabled", True) and scraper.get("filename", "").startswith("providers/")
    }

    for provider_path in sorted(next_provider_paths):
        provider_text = transform_provider_source(fetch_text(provider_path))
        target_path = REPO_ROOT / provider_path
        if write_text_if_changed(target_path, provider_text):
            changed = True
            changed_files.append(provider_path)

    current_registry = {}
    if PROVIDER_REGISTRY_PATH.exists():
        current_registry = json.loads(PROVIDER_REGISTRY_PATH.read_text(encoding="utf-8"))

    current_provider_paths = {
        scraper["filename"]
        for scraper in current_registry.get("scrapers", [])
        if scraper.get("filename", "").startswith("providers/")
    }
    for removed_path in sorted(current_provider_paths - next_provider_paths):
        target_path = REPO_ROOT / removed_path
        if target_path.exists():
            target_path.unlink()
            changed = True
            changed_files.append(removed_path)

    return changed, changed_files


def is_due_to_run(today_utc: date, force: bool) -> bool:
    if force:
        return True
    delta_days = (today_utc - ANCHOR_DATE).days
    return delta_days >= 0 and delta_days % CADENCE_DAYS == 0


def main() -> int:
    force = os.environ.get("FORCE_SYNC", "false").lower() == "true"
    today_utc = datetime.now(timezone.utc).date()

    if not is_due_to_run(today_utc, force):
        write_output("changed", "false")
        write_output("skipped", "true")
        write_summary(
            [
                "## Doom-addon Doom-plug sync",
                "",
                f"Skipped on `{today_utc.isoformat()}` UTC because the 2-day cadence is anchored to `{ANCHOR_DATE.isoformat()}`.",
            ]
        )
        print("Not on the 2-day sync cadence; skipping.")
        return 0

    source_manifest = load_source_manifest()
    changed = False
    changed_files: list[str] = []

    provider_files_changed, changed_provider_files = sync_provider_files(source_manifest)
    changed = changed or provider_files_changed
    changed_files.extend(changed_provider_files)

    if update_registry(source_manifest):
        changed = True
        changed_files.append("providers.json")
    if update_stremio_manifest(source_manifest):
        changed = True
        changed_files.append("manifest.json")
    if update_package(source_manifest):
        changed = True
        changed_files.append("package.json")

    write_output("changed", "true" if changed else "false")
    write_output("skipped", "false")
    write_summary(
        [
            "## Doom-addon Doom-plug sync",
            "",
            f"Checked Doom-plug on `{today_utc.isoformat()}` UTC.",
            f"Source version: `{source_manifest['version']}`",
            f"Changed: `{'true' if changed else 'false'}`",
            "",
            "Changed files:",
            *[f"- `{path}`" for path in changed_files],
        ]
    )

    if changed:
        print("Updated from Doom-plug:")
        for path in changed_files:
            print(f"- {path}")
    else:
        print("No Doom-plug provider changes detected.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
