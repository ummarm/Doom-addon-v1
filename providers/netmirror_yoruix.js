/**
 * netmirror - Built from src/netmirror/
 * Generated: 2026-05-06T09:03:07.585Z
 */
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/netmirror/constants.js
var NETMIRROR_URL = "https://net52.cc";
var TMDB_API_KEY = "439c478a771f35c05022f9feabcca01c";
var PLATFORM_MAP = {
  netflix: {
    ott: "nf",
    search: "/mobile/search.php",
    post: "/mobile/post.php",
    episodes: "/mobile/episodes.php",
    playlist: "/mobile/playlist.php",
    img: "poster/v",
    epImg: "epimg/150"
  },
  primevideo: {
    ott: "pv",
    search: "/mobile/pv/search.php",
    post: "/mobile/pv/post.php",
    episodes: "/mobile/pv/episodes.php",
    playlist: "/mobile/pv/playlist.php",
    img: "pv/v",
    epImg: "pvepimg"
  },
  hotstar: {
    ott: "hs",
    search: "/mobile/hs/search.php",
    post: "/mobile/hs/post.php",
    episodes: "/mobile/hs/episodes.php",
    playlist: "/mobile/hs/playlist.php",
    img: "hs/v",
    epImg: "hsepimg"
  },
  disney: {
    ott: "hs",
    search: "/mobile/hs/search.php",
    post: "/mobile/hs/post.php",
    episodes: "/mobile/hs/episodes.php",
    playlist: "/mobile/hs/playlist.php",
    img: "hs/v",
    epImg: "hsepimg"
  }
};
var BASE_HEADERS = {
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Language": "en-IN,en-US;q=0.9,en;q=0.8",
  "Cache-Control": "max-age=0",
  "Connection": "keep-alive",
  "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144", "Android WebView";v="144"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Android"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent": "Mozilla/5.0 (Linux; Android 13; Pixel 5 Build/TQ3A.230901.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/144.0.7559.132 Safari/537.36 /OS.Gatu v3.0",
  "X-Requested-With": "XMLHttpRequest"
};

// src/netmirror/utils.js
var globalCookie = "";
var cookieTimestamp = 0;
var COOKIE_EXPIRY = 54e6;
function bypass() {
  return __async(this, null, function* () {
    const now = Date.now();
    if (globalCookie && now - cookieTimestamp < COOKIE_EXPIRY) {
      return globalCookie;
    }
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
    const headers = __spreadProps(__spreadValues({}, BASE_HEADERS), {
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://net22.cc",
      "Referer": "https://net22.cc/verify2"
    });
    const response = yield fetch(`${NETMIRROR_URL}/verify.php`, {
      method: "POST",
      headers,
      body: `g-recaptcha-response=${uuid}`,
      redirect: "manual"
    });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      const match = setCookie.match(/t_hash_t=([^;]+)/);
      if (match) {
        globalCookie = match[1];
        cookieTimestamp = Date.now();
        return globalCookie;
      }
    }
    throw new Error("Failed to extract t_hash_t cookie");
  });
}
function getUnixTime() {
  return Math.floor(Date.now() / 1e3);
}

// src/netmirror/index.js
function getStreams(tmdbId, mediaType, season, episode) {
  return __async(this, null, function* () {
    console.log(`[NetMirror] Fetching streams for ${mediaType} ${tmdbId}`);
    try {
      const cookie = yield bypass();
      const cookies = `t_hash_t=${cookie}; hd=on`;
      const tmdbType = mediaType === "tv" ? "tv" : "movie";
      const tmdbResp = yield fetch(`https://api.themoviedb.org/3/${tmdbType}/${tmdbId}?api_key=${TMDB_API_KEY}`);
      const tmdbData = yield tmdbResp.json();
      const title = mediaType === "tv" ? tmdbData.name : tmdbData.title;
      if (!title)
        throw new Error("Could not fetch title from TMDB");
      const platforms = ["netflix", "primevideo", "hotstar", "disney"];
      for (const platformKey of platforms) {
        const platform = PLATFORM_MAP[platformKey];
        const streams = yield fetchFromPlatform(platformKey, title, mediaType, season, episode, cookies);
        if (streams && streams.length > 0)
          return streams;
      }
      return [];
    } catch (error) {
      console.error(`[NetMirror] Error: ${error.message}`);
      return [];
    }
  });
}
function fetchFromPlatform(platformKey, title, mediaType, season, episode, cookies) {
  return __async(this, null, function* () {
    const platform = PLATFORM_MAP[platformKey];
    const searchUrl = `${NETMIRROR_URL}${platform.search}?s=${encodeURIComponent(title)}&t=${getUnixTime()}`;
    const searchResp = yield fetch(searchUrl, {
      headers: __spreadProps(__spreadValues({}, BASE_HEADERS), { Cookie: `${cookies}; ott=${platform.ott}` })
    });
    const searchData = yield searchResp.json();
    if (!searchData.searchResult || searchData.searchResult.length === 0)
      return null;
    const result = searchData.searchResult[0];
    const contentId = result.id;
    const postUrl = `${NETMIRROR_URL}${platform.post}?id=${contentId}&t=${getUnixTime()}`;
    const postResp = yield fetch(postUrl, {
      headers: __spreadProps(__spreadValues({}, BASE_HEADERS), { Cookie: `${cookies}; ott=${platform.ott}` })
    });
    const postData = yield postResp.json();
    let targetId = contentId;
    if (mediaType === "tv") {
      const episodes = yield getAllEpisodes(contentId, postData, platform, cookies);
      const targetEp = episodes.find((ep) => {
        if (!ep)
          return false;
        const s = parseInt(ep.s.replace("S", ""));
        const e = parseInt(ep.ep.replace("E", ""));
        return s === season && e === episode;
      });
      if (targetEp) {
        targetId = targetEp.id;
      } else {
        return null;
      }
    }
    const playlistUrl = `${NETMIRROR_URL}${platform.playlist}?id=${targetId}&t=${encodeURIComponent(title)}&tm=${getUnixTime()}`;
    const playlistResp = yield fetch(playlistUrl, {
      headers: __spreadProps(__spreadValues({}, BASE_HEADERS), { Cookie: `${cookies}; ott=${platform.ott}` })
    });
    const playlist = yield playlistResp.json();
    const streams = [];
    if (Array.isArray(playlist)) {
      playlist.forEach((item) => {
        if (!item.sources)
          return;
        item.sources.forEach((source) => {
          streams.push({
            name: `NetMirror (${platformKey.charAt(0).toUpperCase() + platformKey.slice(1)})`,
            title: `${title} ${source.label}`,
            url: source.file.startsWith("http") ? source.file : `${NETMIRROR_URL}${source.file.startsWith("/") ? "" : "/"}${source.file}`,
            quality: source.label,
            headers: { Referer: `${NETMIRROR_URL}/home`, Cookie: "hd=on" }
          });
        });
      });
    }
    return streams;
  });
}
function getAllEpisodes(contentId, postData, platform, cookies) {
  return __async(this, null, function* () {
    const episodes = [...postData.episodes || []].filter((e) => e !== null);
    if (postData.nextPageShow === 1 && postData.nextPageSeason) {
      const more = yield fetchEpisodesPage(contentId, postData.nextPageSeason, 2, platform, cookies);
      episodes.push(...more);
    }
    if (postData.season && postData.season.length > 1) {
      for (let i = 0; i < postData.season.length - 1; i++) {
        const season = postData.season[i];
        const more = yield fetchEpisodesPage(contentId, season.id, 1, platform, cookies);
        episodes.push(...more);
      }
    }
    return episodes;
  });
}
function fetchEpisodesPage(contentId, seasonId, page, platform, cookies) {
  return __async(this, null, function* () {
    const episodes = [];
    let pg = page;
    while (true) {
      const url = `${NETMIRROR_URL}${platform.episodes}?s=${seasonId}&series=${contentId}&t=${getUnixTime()}&page=${pg}`;
      const resp = yield fetch(url, {
        headers: __spreadProps(__spreadValues({}, BASE_HEADERS), { Cookie: `${cookies}; ott=${platform.ott}` })
      });
      const data = yield resp.json();
      if (data.episodes) {
        episodes.push(...data.episodes.filter((e) => e !== null));
      }
      if (data.nextPageShow === 0)
        break;
      pg++;
    }
    return episodes;
  });
}
module.exports = { getStreams };

// __DOOM_SEEKABLE_VALIDATION__
var __doomProbeCache = Object.create(null);
var __doomProbeCacheTtlMs = 10 * 60 * 1000;
var __doomProbeTimeoutMs = 6 * 1000;

function __doomMergeHeaders(base, extra) {
  var merged = {};
  var key;
  for (key in base || {}) merged[key] = base[key];
  for (key in extra || {}) merged[key] = extra[key];
  return merged;
}

function __doomWithTimeout(promise, timeoutMs) {
  return new Promise(function(resolve, reject) {
    var settled = false;
    var timer = setTimeout(function() {
      if (settled) return;
      settled = true;
      reject(new Error("timeout"));
    }, timeoutMs);

    Promise.resolve(promise).then(function(value) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    }, function(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
  });
}

function __doomLooksLikeHls(url, contentType) {
  var normalizedUrl = String(url || "").toLowerCase();
  var normalizedType = String(contentType || "").toLowerCase();
  return normalizedUrl.indexOf(".m3u8") !== -1
    || normalizedType.indexOf("mpegurl") !== -1
    || normalizedType.indexOf("application/x-mpegurl") !== -1
    || normalizedType.indexOf("vnd.apple.mpegurl") !== -1;
}

function __doomBuildProbeCacheKey(stream) {
  var headers = stream && stream.headers ? stream.headers : {};
  return [
    stream && stream.url ? stream.url : "",
    headers.Referer || headers.referer || "",
    headers.Origin || headers.origin || ""
  ].join("|");
}

function __doomGetCachedProbeResult(cacheKey) {
  var entry = __doomProbeCache[cacheKey];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > __doomProbeCacheTtlMs) {
    delete __doomProbeCache[cacheKey];
    return null;
  }
  return entry.ok;
}

function __doomSetCachedProbeResult(cacheKey, ok) {
  __doomProbeCache[cacheKey] = {
    ok: !!ok,
    timestamp: Date.now()
  };
}

function __doomResponseIsSeekable(response, url) {
  if (!response || !response.ok) return false;
  var headers = response.headers;
  var contentType = headers && headers.get ? headers.get("content-type") || "" : "";
  if (__doomLooksLikeHls(url, contentType)) return true;
  var acceptRanges = headers && headers.get ? headers.get("accept-ranges") || "" : "";
  var contentRange = headers && headers.get ? headers.get("content-range") || "" : "";
  return response.status === 206
    || /bytes/i.test(acceptRanges)
    || /^bytes\s+/i.test(contentRange);
}

function __doomProbeStream(stream) {
  if (!stream || !stream.url || typeof fetch !== "function") {
    return Promise.resolve(false);
  }

  var cacheKey = __doomBuildProbeCacheKey(stream);
  var cached = __doomGetCachedProbeResult(cacheKey);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  var url = stream.url;
  var isHls = __doomLooksLikeHls(url, "");
  var baseHeaders = __doomMergeHeaders({}, stream.headers || {});
  var rangedHeaders = __doomMergeHeaders({}, baseHeaders);
  if (!isHls && !rangedHeaders.Range && !rangedHeaders.range) {
    rangedHeaders.Range = "bytes=0-1";
  }

  var attempts = [
    { method: "GET", headers: isHls ? baseHeaders : rangedHeaders, redirect: "follow" },
    { method: "HEAD", headers: baseHeaders, redirect: "follow" }
  ];

  function tryAttempt(index) {
    if (index >= attempts.length) return Promise.resolve(false);
    return __doomWithTimeout(fetch(url, attempts[index]), __doomProbeTimeoutMs)
      .then(function(response) {
        if (__doomResponseIsSeekable(response, url)) return true;
        return tryAttempt(index + 1);
      })
      .catch(function() {
        return tryAttempt(index + 1);
      });
  }

  return tryAttempt(0).then(function(ok) {
    __doomSetCachedProbeResult(cacheKey, ok);
    return ok;
  });
}

function __doomFilterSeekableStreams(streams, providerLabel) {
  if (!Array.isArray(streams) || streams.length === 0) {
    return Promise.resolve([]);
  }

  return Promise.all(streams.map(function(stream) {
    return __doomProbeStream(stream)
      .then(function(ok) { return { stream: stream, ok: ok }; })
      .catch(function() { return { stream: stream, ok: false }; });
  })).then(function(results) {
    var filtered = results.filter(function(item) { return item.ok; }).map(function(item) { return item.stream; });
    var label = providerLabel || "[Doom-addon]";
    if (filtered.length === 0) {
      console.log(label + " Seekable filter kept 0/" + streams.length + " streams; returning original streams as fallback");
      return streams;
    }
    console.log(label + " Seekable filter kept " + filtered.length + "/" + streams.length + " streams");
    return filtered;
  });
}

(function() {
  if (typeof getStreams !== "function" || getStreams.__doomSeekableWrapped) {
    return;
  }

  var __doomOriginalGetStreams = getStreams;
  var __doomProviderLabel = typeof PLUGIN_TAG !== "undefined"
    ? PLUGIN_TAG
    : (typeof TAG !== "undefined" ? TAG : "[Doom-addon]");

  var __doomWrappedGetStreams = function() {
    return Promise.resolve(__doomOriginalGetStreams.apply(this, arguments))
      .then(function(streams) {
        return __doomFilterSeekableStreams(streams, __doomProviderLabel);
      })
      .catch(function(error) {
        var message = error && error.message ? error.message : String(error);
        console.error(__doomProviderLabel + " Seekable validation failed: " + message);
        return [];
      });
  };

  __doomWrappedGetStreams.__doomSeekableWrapped = true;
  getStreams = __doomWrappedGetStreams;

  if (typeof module !== "undefined" && module.exports) {
    module.exports.getStreams = getStreams;
  } else if (typeof global !== "undefined") {
    global.getStreams = getStreams;
  }
})();

// __DOOM_NETMIRROR_DURATION_FILTER__
var __doomNetMirrorMinDurationSeconds = 10 * 60;
var __doomNetMirrorDurationTimeoutMs = 5 * 1000;

function __doomNetMirrorParseDuration(value) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "number" && isFinite(value) && value > 0) {
    return value > 24 * 60 * 60 ? Math.round(value / 1000) : Math.round(value);
  }

  var text = String(value || "").trim().toLowerCase();
  if (!text) return null;
  var colon = text.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (colon) {
    var parts = text.split(":").map(function(part) { return Number(part); });
    return parts.length === 3
      ? parts[0] * 3600 + parts[1] * 60 + parts[2]
      : parts[0] * 60 + parts[1];
  }

  var hours = text.match(/([\d.]+)\s*(?:h|hr|hrs|hour|hours)\b/);
  var minutes = text.match(/([\d.]+)\s*(?:m|min|mins|minute|minutes)\b/);
  var seconds = text.match(/([\d.]+)\s*(?:s|sec|secs|second|seconds)\b/);
  var total = 0;
  if (hours) total += Number(hours[1]) * 3600;
  if (minutes) total += Number(minutes[1]) * 60;
  if (seconds) total += Number(seconds[1]);
  if (total > 0) return Math.round(total);

  var numeric = text.match(/^\d+(?:\.\d+)?$/);
  if (numeric) {
    var amount = Number(text);
    return amount > 24 * 60 * 60 ? Math.round(amount / 1000) : Math.round(amount);
  }
  return null;
}

function __doomNetMirrorKnownDuration(stream) {
  var hints = stream && stream.behaviorHints ? stream.behaviorHints : {};
  var values = [
    stream && stream.duration,
    stream && stream.runtime,
    stream && stream.length,
    stream && stream.videoDuration,
    stream && stream.durationSeconds,
    hints.duration,
    hints.runtime,
    hints.videoDuration
  ];
  for (var index = 0; index < values.length; index += 1) {
    var parsed = __doomNetMirrorParseDuration(values[index]);
    if (parsed !== null) return parsed;
  }
  return null;
}

function __doomNetMirrorResolveUrl(baseUrl, nextUrl) {
  try {
    return new URL(nextUrl, baseUrl).toString();
  } catch (error) {
    return nextUrl;
  }
}

function __doomNetMirrorFetchText(url, headers) {
  if (typeof fetch !== "function") return Promise.resolve(null);
  return __doomWithTimeout(fetch(url, {
    method: "GET",
    headers: headers || {},
    redirect: "follow"
  }), __doomNetMirrorDurationTimeoutMs)
    .then(function(response) {
      if (!response || !response.ok || !response.text) return null;
      return response.text();
    })
    .catch(function() {
      return null;
    });
}

function __doomNetMirrorPlaylistDuration(stream, depth) {
  if (!stream || !stream.url || !__doomLooksLikeHls(stream.url, "")) {
    return Promise.resolve(null);
  }
  if (depth > 1) return Promise.resolve(null);

  var headers = __doomMergeHeaders({}, stream.headers || {});
  return __doomNetMirrorFetchText(stream.url, headers).then(function(text) {
    if (!text) return null;

    var total = 0;
    var extinfPattern = /#EXTINF:([\d.]+)/g;
    var match;
    while ((match = extinfPattern.exec(text)) !== null) {
      total += Number(match[1]) || 0;
    }
    if (total > 0) return Math.round(total);

    if (/#EXT-X-STREAM-INF/i.test(text)) {
      var lines = text.split(/\r?\n/);
      for (var index = 0; index < lines.length; index += 1) {
        if (!/^#EXT-X-STREAM-INF/i.test(lines[index])) continue;
        for (var next = index + 1; next < lines.length; next += 1) {
          var line = lines[next].trim();
          if (!line || line.charAt(0) === "#") continue;
          var childStream = Object.assign({}, stream, {
            url: __doomNetMirrorResolveUrl(stream.url, line)
          });
          return __doomNetMirrorPlaylistDuration(childStream, depth + 1);
        }
      }
    }
    return null;
  });
}

function __doomNetMirrorDurationSeconds(stream) {
  var known = __doomNetMirrorKnownDuration(stream);
  if (known !== null) return Promise.resolve(known);
  return __doomNetMirrorPlaylistDuration(stream, 0);
}

function __doomNetMirrorFilterShortStreams(streams) {
  if (!Array.isArray(streams) || streams.length === 0) return Promise.resolve([]);

  return Promise.all(streams.map(function(stream) {
    return __doomNetMirrorDurationSeconds(stream)
      .then(function(seconds) { return { stream: stream, seconds: seconds }; })
      .catch(function() { return { stream: stream, seconds: null }; });
  })).then(function(results) {
    return results.filter(function(item) {
      if (item.seconds === null || item.seconds === undefined) return true;
      if (item.seconds >= __doomNetMirrorMinDurationSeconds) return true;
      console.log("[NetMirror Yoruix] Rejected short video stream under 10 minutes (" + item.seconds + "s)");
      return false;
    }).map(function(item) {
      return item.stream;
    });
  });
}

(function() {
  if (typeof getStreams !== "function" || getStreams.__doomNetMirrorDurationWrapped) return;

  var __doomNetMirrorOriginalGetStreams = getStreams;
  var __doomNetMirrorWrappedGetStreams = function() {
    return Promise.resolve(__doomNetMirrorOriginalGetStreams.apply(this, arguments))
      .then(__doomNetMirrorFilterShortStreams);
  };

  __doomNetMirrorWrappedGetStreams.__doomNetMirrorDurationWrapped = true;
  getStreams = __doomNetMirrorWrappedGetStreams;

  if (typeof module !== "undefined" && module.exports) {
    module.exports.getStreams = getStreams;
  } else if (typeof global !== "undefined") {
    global.getStreams = getStreams;
  }
})();

// __DOOM_STREAM_NORMALIZATION__
function __doomNormalizeHeaders(headers) {
  if (!headers || typeof headers !== "object") return null;
  var normalized = {};
  var key;
  for (key in headers) {
    if (headers[key] !== undefined && headers[key] !== null && headers[key] !== "") {
      normalized[key] = String(headers[key]);
    }
  }
  return Object.keys(normalized).length ? normalized : null;
}

function __doomLooksWebReady(url) {
  var normalized = String(url || "").toLowerCase();
  return normalized.indexOf("https://") === 0
    && (normalized.indexOf(".mp4") !== -1 || normalized.indexOf("format=mp4") !== -1);
}

function __doomNormalizeStream(rawStream) {
  if (!rawStream || typeof rawStream !== "object") return null;
  var targetUrl = rawStream.url || rawStream.externalUrl;
  if (!targetUrl || typeof targetUrl !== "string") return null;

  var requestHeaders = __doomNormalizeHeaders(rawStream.headers);
  var behaviorHints = {};
  var key;
  for (key in rawStream.behaviorHints || {}) behaviorHints[key] = rawStream.behaviorHints[key];

  if (rawStream.fileName && !behaviorHints.filename) behaviorHints.filename = rawStream.fileName;
  if (typeof rawStream.size === "number" && rawStream.size > 0 && !behaviorHints.videoSize) {
    behaviorHints.videoSize = rawStream.size;
  }
  if (typeof rawStream.videoSize === "number" && rawStream.videoSize > 0 && !behaviorHints.videoSize) {
    behaviorHints.videoSize = rawStream.videoSize;
  }
  if (!behaviorHints.bingeGroup) {
    var providerId = typeof PLUGIN_TAG !== "undefined" ? PLUGIN_TAG : (typeof TAG !== "undefined" ? TAG : "doom-addon");
    behaviorHints.bingeGroup = String(providerId).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  }
  if (!__doomLooksWebReady(targetUrl) || requestHeaders) behaviorHints.notWebReady = true;
  if (requestHeaders) behaviorHints.proxyHeaders = { request: requestHeaders };

  var description = rawStream.description || rawStream.title || rawStream.name || "Doom-addon stream";
  return {
    name: rawStream.name || "Doom-addon",
    title: description,
    description: description,
    url: targetUrl,
    behaviorHints: behaviorHints
  };
}

(function() {
  if (typeof getStreams !== "function" || getStreams.__doomNormalizedWrapped) return;

  var __doomOriginalGetStreamsForNormalization = getStreams;
  var __doomNormalizedGetStreams = function() {
    return Promise.resolve(__doomOriginalGetStreamsForNormalization.apply(this, arguments))
      .then(function(streams) {
        if (!Array.isArray(streams)) return [];
        return streams.map(__doomNormalizeStream).filter(Boolean);
      });
  };

  __doomNormalizedGetStreams.__doomNormalizedWrapped = true;
  getStreams = __doomNormalizedGetStreams;

  if (typeof module !== "undefined" && module.exports) {
    module.exports.getStreams = getStreams;
  } else if (typeof global !== "undefined") {
    global.getStreams = getStreams;
  }
})();
