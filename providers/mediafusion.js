"use strict";

const PROVIDER_NAME = "MediaFusion";
const DEFAULT_MANIFEST_URL = "https://mediafusion.elfhosted.com/U-9ec0cde3-8d91-4448-9523-20cc86d363ea/manifest.json";

function configuredBaseUrl() {
  const raw = process.env.MEDIAFUSION_MANIFEST_URL || process.env.MEDIAFUSION_BASE_URL || DEFAULT_MANIFEST_URL;
  if (!raw) {
    return "";
  }
  return raw.replace(/\/manifest\.json$/i, "").replace(/\/+$/, "");
}

function streamId(tmdbId, mediaType, season, episode) {
  const baseId = `tmdb:${tmdbId}`;
  if ((mediaType === "series" || mediaType === "tv") && season != null && episode != null) {
    return `${baseId}:${season}:${episode}`;
  }
  return baseId;
}

async function fetchMediaFusionStreams(tmdbId, mediaType, season, episode) {
  const baseUrl = configuredBaseUrl();
  if (!baseUrl) {
    return [];
  }

  const stremioType = mediaType === "tv" ? "series" : mediaType;
  const id = streamId(tmdbId, stremioType, season, episode);
  const url = `${baseUrl}/stream/${encodeURIComponent(stremioType)}/${encodeURIComponent(id)}.json`;
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "User-Agent": "Doom-addon/1.0"
    },
    redirect: "follow"
  });
  if (!response.ok) {
    throw new Error(`${PROVIDER_NAME} returned HTTP ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload.streams) ? payload.streams : [];
}

function normalizeMediaFusionStream(stream) {
  if (!stream || !stream.url) {
    return null;
  }

  const behaviorHints = stream.behaviorHints || {};
  const filename = stream.filename || stream.fileName || behaviorHints.filename || stream.name;
  return {
    name: stream.name || filename || PROVIDER_NAME,
    title: stream.title || stream.description || stream.name || filename || PROVIDER_NAME,
    description: stream.description || stream.title || stream.name || filename || PROVIDER_NAME,
    url: stream.url,
    quality: stream.quality,
    size: stream.size,
    videoSize: stream.videoSize || behaviorHints.videoSize,
    behaviorHints,
    headers: stream.headers,
    filename,
    fileName: filename
  };
}

async function getStreams(tmdbId, mediaType = "movie", season = null, episode = null) {
  try {
    const streams = await fetchMediaFusionStreams(tmdbId, mediaType, season, episode);
    return streams.map(normalizeMediaFusionStream).filter(Boolean);
  } catch (error) {
    console.error(`[${PROVIDER_NAME}] ${error.message || error}`);
    return [];
  }
}

module.exports = { getStreams };
