#!/usr/bin/env node
'use strict';

const fs    = require('fs');
const path  = require('path');
const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Doom-addon-v1-sync/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location)
        return fetch(res.headers.location).then(resolve).catch(reject);
      if (res.statusCode !== 200)
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
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

function readJSON(file)        { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function writeJSON(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8'); console.log(`  wrote ${path.relative(ROOT, file)}`); }
function ensureDir(dir)        { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

const ROOT = path.join(__dirname, '..');

const UPSTREAMS = {
  d3adlyrocket: 'https://raw.githubusercontent.com/D3adlyRocket/All-in-One-Nuvio/refs/heads/main/manifest.json',
  yoruix:       'https://raw.githubusercontent.com/yoruix/nuvio-providers/refs/heads/main/manifest.json',
  flixnest:     'https://flixnest.app/flix-streams/u/6p9xzp78nunz/manifest.json',
  murph:        'https://badboysxs-morpheus.hf.space/manifest.json',
};

const RAW_BASE = {
  d3adlyrocket: 'https://raw.githubusercontent.com/D3adlyRocket/All-in-One-Nuvio/refs/heads/main/',
  yoruix:       'https://raw.githubusercontent.com/yoruix/nuvio-providers/refs/heads/main/',
  flixnest:     null,
  murph:        null,
};

const DOMAIN_SOURCES = [
  'https://raw.githubusercontent.com/ummarm/Doom-addon-v1/main/domains.json',
  'https://raw.githubusercontent.com/phisher98/TVVVV/refs/heads/main/domains.json',
];

const PROTECTED_PROVIDERS = new Set([
  'flix_streams_emby','flix_streams_mkvcinemas','flix_streams_lotusvault',
  'flix_streams_archivevault','flix_streams_uhdmovies','flix_streams_vegamovies',
  'flix_streams_other','mediafusion','aiostreams','hindmoviez','streamflix',
]);

async function main() {
  console.log('=== Doom-addon-v1 upstream sync ===');
  console.log(`Time: ${new Date().toISOString()}`);

  const force = process.env.FORCE === 'true';
  if (force) console.log('Force mode enabled.');

  ensureDir(path.join(ROOT, 'providers'));

  const providersPath = path.join(ROOT, 'providers.json');
  const manifestPath  = path.join(ROOT, 'manifest.json');
  const pkgPath       = path.join(ROOT, 'package.json');

  const currentProvidersJson = readJSON(providersPath);
  const currentManifest      = readJSON(manifestPath);
  const currentPkg           = readJSON(pkgPath);

  // providers.json uses "scrapers" key
  const currentScrapers = currentProvidersJson.scrapers || [];
  const existingById = {};
  for (const s of currentScrapers) existingById[s.id] = s;

  let changed = false;

  // 1. Fetch upstream manifests
  const upstreamManifests = {};
  for (const [key, url] of Object.entries(UPSTREAMS)) {
    try {
      console.log(`\nFetching upstream: ${key} ...`);
      upstreamManifests[key] = await fetchJSON(url);
      console.log(`  ok: ${(upstreamManifests[key].scrapers || []).length} scrapers`);
    } catch (err) {
      console.warn(`  failed: ${err.message} — skipping`);
      upstreamManifests[key] = null;
    }
  }

  // 2. Sync provider JS files
  console.log('\n--- Syncing provider JS files ---');
  for (const [upstreamKey, manifest] of Object.entries(upstreamManifests)) {
    if (!manifest) continue;
    const rawBase = RAW_BASE[upstreamKey];
    if (!rawBase) continue;

    for (const scraper of (manifest.scrapers || [])) {
      if (!scraper.filename) continue;
      if (PROTECTED_PROVIDERS.has(scraper.id)) {
        console.log(`  [protected] ${scraper.id}`);
        continue;
      }

      const localFile = `providers/${scraper.id}.js`;
      const localPath = path.join(ROOT, localFile);
      const remoteUrl = rawBase + scraper.filename;

      try {
        const remoteContent = await fetch(remoteUrl);
        const patched = remoteContent.replace(
          /https:\/\/raw\.githubusercontent\.com\/[^"'\s]+\/domains\.json/g,
          'https://raw.githubusercontent.com/ummarm/Doom-addon-v1/main/domains.json'
        );
        const existing = fs.existsSync(localPath) ? fs.readFileSync(localPath, 'utf8') : null;
        if (force || existing !== patched) {
          fs.writeFileSync(localPath, patched, 'utf8');
          console.log(`  updated: ${localFile}`);
          changed = true;
        } else {
          console.log(`  unchanged: ${localFile}`);
        }
      } catch (err) {
        console.warn(`  could not fetch ${remoteUrl}: ${err.message}`);
      }
    }
  }

  // 3. Refresh domains.json
  console.log('\n--- Refreshing domains.json ---');
  let domains = readJSON(path.join(ROOT, 'domains.json'));
  for (const url of DOMAIN_SOURCES) {
    try {
      const remote = await fetchJSON(url);
      for (const [k, v] of Object.entries(remote)) {
        if (v && v !== domains[k]) {
          domains[k] = v;
          console.log(`  updated: ${k} → ${v}`);
          changed = true;
        }
      }
    } catch (err) {
      console.warn(`  domain source failed (${url}): ${err.message}`);
    }
  }
  writeJSON(path.join(ROOT, 'domains.json'), domains);

  // 4. Rebuild providers.json — preserve existing scrapers, merge upstream metadata
  console.log('\n--- Rebuilding providers.json ---');

  const upstreamMeta = {};
  for (const manifest of Object.values(upstreamManifests)) {
    if (!manifest) continue;
    for (const s of (manifest.scrapers || [])) {
      if (!upstreamMeta[s.id]) upstreamMeta[s.id] = s;
    }
  }

  const diskFiles = fs.readdirSync(path.join(ROOT, 'providers')).filter(f => f.endsWith('.js'));
  const diskIds   = new Set(diskFiles.map(f => f.replace('.js', '')));

  // Update existing scrapers with fresh upstream version/logo
  const updatedScrapers = currentScrapers.map(scraper => {
    const up = upstreamMeta[scraper.id];
    if (!up) return scraper;
    return {
      ...scraper,
      version: up.version || scraper.version,
      ...(up.logo ? { logo: up.logo } : {}),
    };
  });

  // Add brand-new scrapers that appeared in upstream and have a JS file on disk
  const existingIds = new Set(updatedScrapers.map(s => s.id));
  for (const [id, meta] of Object.entries(upstreamMeta)) {
    if (existingIds.has(id)) continue;
    if (!diskIds.has(id)) continue;
    if (PROTECTED_PROVIDERS.has(id)) continue;
    updatedScrapers.push({
      id,
      name:            meta.name || id,
      description:     meta.description || '',
      version:         meta.version || '1.0.0',
      author:          'ummarm',
      supportedTypes:  meta.supportedTypes || ['movie', 'tv'],
      filename:        `providers/${id}.js`,
      enabled:         true,
      formats:         meta.formats || ['mp4', 'm3u8'],
      logo:            meta.logo || '',
      contentLanguage: meta.contentLanguage || ['en'],
    });
    console.log(`  added new scraper: ${id}`);
    changed = true;
  }

  const newProvidersJson = { ...currentProvidersJson, scrapers: updatedScrapers };

  if (JSON.stringify(updatedScrapers) !== JSON.stringify(currentScrapers)) {
    writeJSON(providersPath, newProvidersJson);
    changed = true;
  } else {
    console.log('  providers.json unchanged');
  }

  // 5. Bump version if anything changed
  if (changed || force) {
    console.log('\n--- Bumping version ---');
    const today      = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
    const newVersion = `1.0.${today}`;
    if (currentManifest.version !== newVersion) {
      currentManifest.version = newVersion;
      writeJSON(manifestPath, currentManifest);
    }
    if (currentPkg.version !== newVersion) {
      currentPkg.version = newVersion;
      writeJSON(pkgPath, currentPkg);
    }
  }

  // 6. Fix upstreams.json to point to this repo
  const upstreamsPath = path.join(ROOT, 'upstreams.json');
  const upstreamsJson = readJSON(upstreamsPath);
  const selfUrl = 'https://raw.githubusercontent.com/ummarm/Doom-addon-v1/main/domains.json';
  if (upstreamsJson.domainSources?.doomAddon !== selfUrl) {
    upstreamsJson.domainSources = upstreamsJson.domainSources || {};
    upstreamsJson.domainSources.doomAddon = selfUrl;
    writeJSON(upstreamsPath, upstreamsJson);
    changed = true;
    console.log('\n  fixed upstreams.json → Doom-addon-v1');
  }

  console.log('\n=== Sync complete ===');
  console.log(changed ? 'Changes detected — commit will follow.' : 'Nothing changed.');
}

main().catch(err => {
  console.error('\n[FATAL]', err.message);
  process.exit(1);
});
