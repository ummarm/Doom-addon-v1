#!/usr/bin/env node
/**
 * upstream-sync.js  –  Doom-addon-v1
 *
 * Runs every day via GitHub Actions.
 * Fetches each upstream manifest, downloads the provider JS files that
 * changed, refreshes domains.json, and rewrites providers.json /
 * manifest.json / package.json so the add-on never goes stale.
 *
 * 100 % self-contained – no dependency on ummarm/Doom-addon.
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const https = require('https');

// ─── helpers ────────────────────────────────────────────────────────────────

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Doom-addon-v1-sync/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

function fetchJSON(url) {
  return fetch(url).then(text => {
    try { return JSON.parse(text); }
    catch (e) { throw new Error(`Bad JSON from ${url}: ${e.message}`); }
  });
}

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`  wrote ${file}`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ─── config ─────────────────────────────────────────────────────────────────

const ROOT = path.join(__dirname, '..');   // repo root

const UPSTREAMS = {
  d3adlyrocket: 'https://raw.githubusercontent.com/D3adlyRocket/All-in-One-Nuvio/refs/heads/main/manifest.json',
  yoruix:       'https://raw.githubusercontent.com/yoruix/nuvio-providers/refs/heads/main/manifest.json',
  flixnest:     'https://flixnest.app/flix-streams/u/6p9xzp78nunz/manifest.json',
  murph:        'https://badboysxs-morpheus.hf.space/manifest.json',
};

// Raw-content base URLs for each upstream (used to download provider JS files)
const RAW_BASE = {
  d3adlyrocket: 'https://raw.githubusercontent.com/D3adlyRocket/All-in-One-Nuvio/refs/heads/main/',
  yoruix:       'https://raw.githubusercontent.com/yoruix/nuvio-providers/refs/heads/main/',
  flixnest:     null,   // Flix-Streams providers are wrappers, not raw JS files
  murph:        null,   // Morpheus providers are wrappers
};

// Domain sources — both checked; freshest / non-empty value wins
const DOMAIN_SOURCES = [
  'https://raw.githubusercontent.com/ummarm/Doom-addon-v1/main/domains.json',  // own repo (self)
  'https://raw.githubusercontent.com/phisher98/TVVVV/refs/heads/main/domains.json', // upstream domain list
];

// Providers that are hand-written wrappers in this repo and must NOT be
// overwritten by upstream sync (they have custom logic).
const PROTECTED_PROVIDERS = new Set([
  'flix_streams_emby',
  'flix_streams_mkvcinemas',
  'flix_streams_lotusvault',
  'flix_streams_archivevault',
  'flix_streams_uhdmovies',
  'flix_streams_vegamovies',
  'flix_streams_other',
  'mediafusion',
  'aiostreams',
  'hindmoviez',
  'streamflix',   // currently disabled but kept
]);

// ─── main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Doom-addon-v1 upstream sync ===');
  console.log(`Time: ${new Date().toISOString()}`);

  const force = process.env.FORCE === 'true';
  if (force) console.log('Force mode enabled — will overwrite unchanged files too.');

  ensureDir(path.join(ROOT, 'providers'));

  // 1. Load current state
  const currentProviders = readJSON(path.join(ROOT, 'providers.json'));
  const currentManifest  = readJSON(path.join(ROOT, 'manifest.json'));
  const currentPkg       = readJSON(path.join(ROOT, 'package.json'));

  let changed = false;

  // 2. Fetch all upstream manifests
  const upstreamManifests = {};
  for (const [key, url] of Object.entries(UPSTREAMS)) {
    try {
      console.log(`\nFetching upstream manifest: ${key} …`);
      upstreamManifests[key] = await fetchJSON(url);
      const count = (upstreamManifests[key].scrapers || []).length;
      console.log(`  ✓ ${count} scrapers`);
    } catch (err) {
      console.warn(`  ✗ Failed to fetch ${key}: ${err.message} — skipping`);
      upstreamManifests[key] = null;
    }
  }

  // 3. Sync provider JS files from upstreams that expose raw JS
  console.log('\n--- Syncing provider JS files ---');
  for (const [upstreamKey, manifest] of Object.entries(upstreamManifests)) {
    if (!manifest) continue;
    const rawBase = RAW_BASE[upstreamKey];
    if (!rawBase) continue;  // wrapper-only upstream — no JS to download

    const scrapers = manifest.scrapers || [];
    for (const scraper of scrapers) {
      if (!scraper.filename) continue;

      // Derive local filename from the scraper id
      const localFile = `providers/${scraper.id}.js`;
      const localPath = path.join(ROOT, localFile);

      // Skip protected providers
      if (PROTECTED_PROVIDERS.has(scraper.id)) {
        console.log(`  [protected] ${scraper.id} — skipped`);
        continue;
      }

      const remoteUrl = rawBase + scraper.filename;
      try {
        const remoteContent = await fetch(remoteUrl);

        // Retarget domain lookups to THIS repo's domains.json
        const patched = remoteContent
          .replace(
            /https:\/\/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/domains\.json/g,
            'https://raw.githubusercontent.com/ummarm/Doom-addon-v1/main/domains.json'
          );

        const existingContent = fs.existsSync(localPath)
          ? fs.readFileSync(localPath, 'utf8')
          : null;

        if (force || existingContent !== patched) {
          fs.writeFileSync(localPath, patched, 'utf8');
          console.log(`  ✓ updated  ${localFile}`);
          changed = true;
        } else {
          console.log(`  – unchanged ${localFile}`);
        }
      } catch (err) {
        console.warn(`  ✗ Could not fetch ${remoteUrl}: ${err.message}`);
      }
    }
  }

  // 4. Refresh domains.json
  console.log('\n--- Refreshing domains.json ---');
  let bestDomains = readJSON(path.join(ROOT, 'domains.json'));
  for (const url of DOMAIN_SOURCES) {
    try {
      const remoteDomains = await fetchJSON(url);
      // Merge: remote values win for any key that exists in remote
      let merged = { ...bestDomains };
      let domainChanged = false;
      for (const [k, v] of Object.entries(remoteDomains)) {
        if (v && v !== merged[k]) {
          merged[k] = v;
          domainChanged = true;
          console.log(`  updated domain ${k}: ${v}`);
        }
      }
      if (domainChanged) {
        bestDomains = merged;
        changed = true;
      } else {
        console.log(`  no domain changes from ${url}`);
      }
    } catch (err) {
      console.warn(`  ✗ Domain source failed (${url}): ${err.message}`);
    }
  }
  writeJSON(path.join(ROOT, 'domains.json'), bestDomains);

  // 5. Rebuild providers.json from scratch based on what JS files exist
  console.log('\n--- Rebuilding providers.json ---');
  const existingProviderFiles = fs.readdirSync(path.join(ROOT, 'providers'))
    .filter(f => f.endsWith('.js'));

  // Build a lookup of upstream scraper metadata keyed by id
  const scraperMeta = {};
  for (const manifest of Object.values(upstreamManifests)) {
    if (!manifest) continue;
    for (const s of (manifest.scrapers || [])) {
      if (!scraperMeta[s.id]) scraperMeta[s.id] = s;
    }
  }

  // Merge with existing providers.json entries (preserve enabled/disabled state
  // and custom fields for protected providers)
  const existingById = {};
  for (const p of (currentProviders.providers || currentProviders)) {
    existingById[p.id] = p;
  }

  const newProviders = existingProviderFiles.map(file => {
    const id = file.replace('.js', '');
    const existing = existingById[id];
    const upstream = scraperMeta[id];

    return {
      id,
      name:     upstream?.name  || existing?.name  || id,
      version:  upstream?.version || existing?.version || '1.0.0',
      enabled:  existing?.enabled !== undefined ? existing.enabled : true,
      filename: `providers/${file}`,
      ...(upstream?.logo    ? { logo: upstream.logo }              : {}),
      ...(upstream?.formats ? { formats: upstream.formats }        : {}),
      ...(upstream?.contentLanguage ? { contentLanguage: upstream.contentLanguage } : {}),
    };
  });

  const newProvidersJson = Array.isArray(currentProviders)
    ? newProviders
    : { ...currentProviders, providers: newProviders };

  if (JSON.stringify(newProvidersJson) !== JSON.stringify(currentProviders)) {
    writeJSON(path.join(ROOT, 'providers.json'), newProvidersJson);
    changed = true;
  } else {
    console.log('  providers.json unchanged');
  }

  // 6. Bump version in manifest.json and package.json
  if (changed || force) {
    console.log('\n--- Bumping version ---');
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const newVersion = `1.0.${today}`;

    if (currentManifest.version !== newVersion) {
      currentManifest.version = newVersion;
      writeJSON(path.join(ROOT, 'manifest.json'), currentManifest);
    }

    if (currentPkg.version !== newVersion) {
      currentPkg.version = newVersion;
      writeJSON(path.join(ROOT, 'package.json'), currentPkg);
    }
  }

  // 7. Ensure upstreams.json points to THIS repo (not Doom-addon)
  const upstreamsPath = path.join(ROOT, 'upstreams.json');
  const upstreamsJson = readJSON(upstreamsPath);
  const selfUrl = 'https://raw.githubusercontent.com/ummarm/Doom-addon-v1/main/domains.json';
  if (upstreamsJson.domainSources?.doomAddon !== selfUrl) {
    upstreamsJson.domainSources = upstreamsJson.domainSources || {};
    upstreamsJson.domainSources.doomAddon = selfUrl;
    writeJSON(upstreamsPath, upstreamsJson);
    changed = true;
    console.log('\n  fixed upstreams.json → now points to Doom-addon-v1');
  }

  console.log('\n=== Sync complete ===');
  console.log(changed ? 'Changes detected — commit will be made.' : 'Nothing changed.');
}

main().catch(err => {
  console.error('\n[FATAL]', err.message);
  process.exit(1);
});
