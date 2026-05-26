function _0x53ae(_0x1559bd,_0x2cca56){_0x1559bd=_0x1559bd-0x1ec;const _0x1ec569=_0x1ec5();let _0x53aede=_0x1ec569[_0x1559bd];if(_0x53ae['saMzIv']===undefined){var _0x4f0a65=function(_0x409e96){const _0x50f6bf='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x3f45ac='',_0x35ba47='';for(let _0x20d97c=0x0,_0x43edb7,_0x377301,_0x593434=0x0;_0x377301=_0x409e96['charAt'](_0x593434++);~_0x377301&&(_0x43edb7=_0x20d97c%0x4?_0x43edb7*0x40+_0x377301:_0x377301,_0x20d97c++%0x4)?_0x3f45ac+=String['fromCharCode'](0xff&_0x43edb7>>(-0x2*_0x20d97c&0x6)):0x0){_0x377301=_0x50f6bf['indexOf'](_0x377301);}for(let _0x110bdd=0x0,_0x5cabe5=_0x3f45ac['length'];_0x110bdd<_0x5cabe5;_0x110bdd++){_0x35ba47+='%'+('00'+_0x3f45ac['charCodeAt'](_0x110bdd)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x35ba47);};_0x53ae['SHlxvN']=_0x4f0a65,_0x53ae['CIdBQf']={},_0x53ae['saMzIv']=!![];}const _0x138a1d=_0x1ec569[0x0],_0x1227b4=_0x1559bd+_0x138a1d,_0x942378=_0x53ae['CIdBQf'][_0x1227b4];return!_0x942378?(_0x53aede=_0x53ae['SHlxvN'](_0x53aede),_0x53ae['CIdBQf'][_0x1227b4]=_0x53aede):_0x53aede=_0x942378,_0x53aede;}const _0x398e18=_0x53ae;(function(_0x2f01f1,_0x311954){const _0x3e6bb0=_0x53ae,_0x5e6ea1=_0x2f01f1();while(!![]){try{const _0xc831ec=-parseInt(_0x3e6bb0(0x20d))/0x1*(-parseInt(_0x3e6bb0(0x221))/0x2)+-parseInt(_0x3e6bb0(0x21b))/0x3*(parseInt(_0x3e6bb0(0x1ed))/0x4)+parseInt(_0x3e6bb0(0x203))/0x5*(parseInt(_0x3e6bb0(0x21e))/0x6)+parseInt(_0x3e6bb0(0x230))/0x7*(parseInt(_0x3e6bb0(0x224))/0x8)+-parseInt(_0x3e6bb0(0x20c))/0x9+parseInt(_0x3e6bb0(0x217))/0xa+parseInt(_0x3e6bb0(0x231))/0xb*(-parseInt(_0x3e6bb0(0x22b))/0xc);if(_0xc831ec===_0x311954)break;else _0x5e6ea1['push'](_0x5e6ea1['shift']());}catch(_0x20591c){_0x5e6ea1['push'](_0x5e6ea1['shift']());}}}(_0x1ec5,0x8e46f));var __async=(_0x3f45ac,_0x35ba47,_0x20d97c)=>{return new Promise((_0x43edb7,_0x377301)=>{const _0x4c1e51=_0x53ae;var _0x593434=_0x33d05c=>{const _0x198eb4=_0x53ae;try{_0x5cabe5(_0x20d97c[_0x198eb4(0x1ff)](_0x33d05c));}catch(_0x2e24cc){_0x377301(_0x2e24cc);}},_0x110bdd=_0x2a2cb7=>{const _0x4d91c8=_0x53ae;try{_0x5cabe5(_0x20d97c[_0x4d91c8(0x219)](_0x2a2cb7));}catch(_0x4818f8){_0x377301(_0x4818f8);}},_0x5cabe5=_0x243bc4=>_0x243bc4['done']?_0x43edb7(_0x243bc4[_0x4c1e51(0x22e)]):Promise[_0x4c1e51(0x1ef)](_0x243bc4[_0x4c1e51(0x22e)])[_0x4c1e51(0x216)](_0x593434,_0x110bdd);_0x5cabe5((_0x20d97c=_0x20d97c['apply'](_0x3f45ac,_0x35ba47))[_0x4c1e51(0x1ff)]());});},CONFIG_URL=_0x398e18(0x22a),FALLBACK_NF_API=_0x398e18(0x233),OTT_SERVICES=[{'code':'nf','name':'Netflix'},{'code':'pv','name':_0x398e18(0x21c)},{'code':'hs','name':_0x398e18(0x209)}],TMDB_API_KEY=_0x398e18(0x222),TMDB_BASE_URL=_0x398e18(0x20e);function getNfMirrorApi(){return __async(this,null,function*(){const _0x24e963=_0x53ae;try{const _0x1927cb=yield fetch(CONFIG_URL),_0x295f47=yield _0x1927cb[_0x24e963(0x21f)]();return _0x295f47['nfmirror']||FALLBACK_NF_API;}catch(_0x5b9ff7){return console['warn'](_0x24e963(0x1f1),FALLBACK_NF_API),FALLBACK_NF_API;}});}function getMediaDetails(_0x41cbcb,_0x735dc6){return __async(this,null,function*(){const _0x9df85e=_0x53ae,_0x25ac3d=_0x735dc6==='tv'?'tv':_0x9df85e(0x1f7),_0xfbc438=TMDB_BASE_URL+'/'+_0x25ac3d+'/'+_0x41cbcb+_0x9df85e(0x1f2)+TMDB_API_KEY,_0xc232b0=yield fetch(_0xfbc438);return _0xc232b0[_0x9df85e(0x21f)]();});}function getStreams(_0x1541b4,_0x1cca6e,_0x157a63,_0x335d31){return __async(this,null,function*(){const _0x42d77b=_0x53ae;console[_0x42d77b(0x1f8)](_0x42d77b(0x215)+_0x1cca6e+'\x20'+_0x1541b4);const _0xdc2699=[];try{const _0x1a0b49=yield getMediaDetails(_0x1541b4,_0x1cca6e),_0x233bb5=_0x1cca6e==='tv'?_0x1a0b49['name']:_0x1a0b49[_0x42d77b(0x214)];if(!_0x233bb5)return console[_0x42d77b(0x1f8)](_0x42d77b(0x1f5)),[];const _0x5d7a57=yield getNfMirrorApi();console[_0x42d77b(0x1f8)](_0x42d77b(0x207)+_0x5d7a57);const _0x175a66=OTT_SERVICES[_0x42d77b(0x1ec)](_0x43823c=>extractServiceStreams(_0x5d7a57,_0x43823c,_0x233bb5,_0x1cca6e,_0x157a63,_0x335d31)[_0x42d77b(0x227)](_0x318a62=>{const _0x2f87ab=_0x42d77b;return console[_0x2f87ab(0x20a)](_0x2f87ab(0x1f0)+_0x43823c[_0x2f87ab(0x228)]+':',_0x318a62[_0x2f87ab(0x1fc)]),[];})),_0x474573=yield Promise[_0x42d77b(0x202)](_0x175a66);for(const _0x25d68a of _0x474573){_0xdc2699[_0x42d77b(0x1f3)](..._0x25d68a);}}catch(_0x207087){console[_0x42d77b(0x21a)](_0x42d77b(0x204),_0x207087[_0x42d77b(0x1fc)]);}return console['log'](_0x42d77b(0x211)+_0xdc2699[_0x42d77b(0x21d)]+_0x42d77b(0x1fa)),_0xdc2699;});}function extractServiceStreams(_0x3518d4,_0xd76e20,_0x3f5837,_0x49cec5,_0x5aae17,_0x3266ec){return __async(this,null,function*(){const _0x368b2f=_0x53ae,_0x255298=[],_0x12b4ef=_0x3f5837[_0x368b2f(0x1ee)](),_0x56fd3f={'ott':_0xd76e20[_0x368b2f(0x1f4)],'user-agent':_0x368b2f(0x22c),'x-requested-with':_0x368b2f(0x201)};console[_0x368b2f(0x1f8)](_0x368b2f(0x1fd)+_0xd76e20[_0x368b2f(0x228)]+_0x368b2f(0x220)+_0x12b4ef+'\x22');const _0x392bdf=_0x3518d4+_0x368b2f(0x20b)+encodeURIComponent(_0x12b4ef),_0x5117b4=yield fetch(_0x392bdf,{'headers':_0x56fd3f}),_0x4bf1d1=yield _0x5117b4[_0x368b2f(0x21f)](),_0xeb1d1a=_0x4bf1d1['searchResult']||[],_0x1402f0=_0xeb1d1a[_0x368b2f(0x1fb)](_0x2902a5=>_0x2902a5['t']&&_0x2902a5['t'][_0x368b2f(0x1ee)]()[_0x368b2f(0x1f6)]()===_0x12b4ef[_0x368b2f(0x1f6)]());if(!_0x1402f0||!_0x1402f0['id'])return console[_0x368b2f(0x1f8)]('[NetMirror]\x20No\x20direct\x20match\x20on\x20'+_0xd76e20[_0x368b2f(0x228)]),[];const _0x5d479d=_0x1402f0['id'];let _0x37ad95=_0x5d479d;if(_0x49cec5==='tv'){console[_0x368b2f(0x1f8)]('[NetMirror]\x20TV\x20Match\x20on\x20'+_0xd76e20[_0x368b2f(0x228)]+_0x368b2f(0x225)+_0x5d479d+_0x368b2f(0x22d)+_0x5aae17+'E'+_0x3266ec);const _0x5f2a6e=yield fetch(_0x3518d4+_0x368b2f(0x1fe)+_0x5d479d,{'headers':_0x56fd3f}),_0x178733=yield _0x5f2a6e[_0x368b2f(0x21f)](),_0xe094c1=_0x178733[_0x368b2f(0x229)]||[],_0x18afe4='Season\x20'+_0x5aae17,_0x18c6da=_0xe094c1[_0x368b2f(0x1fb)](_0x3c1f23=>_0x3c1f23['s']&&_0x3c1f23['s'][_0x368b2f(0x1f9)]()[_0x368b2f(0x232)](_0x18afe4));if(!_0x18c6da||!_0x18c6da['id'])return console['log'](_0x368b2f(0x213)+_0x5aae17+_0x368b2f(0x210)+_0xd76e20[_0x368b2f(0x228)]),[];const _0x2850b5=_0x18c6da['id'];let _0x38fe4e=null,_0x5222ec=0x1;while(!_0x38fe4e&&_0x5222ec<0xa){console[_0x368b2f(0x1f8)]('[NetMirror]\x20Paging\x20episodes\x20list\x20(Page\x20'+_0x5222ec+_0x368b2f(0x234)+_0xd76e20[_0x368b2f(0x228)]);const _0x477cad=yield fetch(_0x3518d4+_0x368b2f(0x206)+_0x2850b5+_0x368b2f(0x20f)+_0x5222ec,{'headers':_0x56fd3f}),_0x3559fd=yield _0x477cad[_0x368b2f(0x21f)](),_0x56a242=_0x3559fd['episodes']||[],_0x3935f6=_0x56a242[_0x368b2f(0x1fb)](_0x15c3dd=>_0x15c3dd['ep']&&_0x15c3dd['ep'][_0x368b2f(0x1f9)]()===_0x3266ec[_0x368b2f(0x1f9)]());_0x3935f6&&_0x3935f6['id']&&(_0x38fe4e=_0x3935f6['id']);if(parseInt(_0x3559fd['nextPageShow'])!==0x1)break;_0x5222ec++;}if(!_0x38fe4e)return console[_0x368b2f(0x1f8)]('[NetMirror]\x20Episode\x20'+_0x3266ec+'\x20not\x20found\x20on\x20'+_0xd76e20['name']),[];_0x37ad95=_0x38fe4e;}console[_0x368b2f(0x1f8)](_0x368b2f(0x208)+_0x37ad95+'\x20on\x20'+_0xd76e20['name']);const _0x2f6db9=yield fetch(_0x3518d4+'/player.php?id='+_0x37ad95,{'headers':_0x56fd3f}),_0x2845ca=yield _0x2f6db9[_0x368b2f(0x21f)]();return _0x2845ca&&_0x2845ca[_0x368b2f(0x200)]&&(_0x255298[_0x368b2f(0x1f3)]({'name':_0xd76e20[_0x368b2f(0x228)],'title':_0x368b2f(0x226),'url':_0x2845ca[_0x368b2f(0x200)],'quality':_0x368b2f(0x226),'headers':{'Referer':_0x2845ca[_0x368b2f(0x212)]||'','User-Agent':_0x56fd3f[_0x368b2f(0x205)]},'provider':_0x368b2f(0x218)}),console[_0x368b2f(0x1f8)](_0x368b2f(0x223)+_0xd76e20[_0x368b2f(0x228)])),_0x255298;});}function _0x1ec5(){const _0x436f46=['sg90C3rHCG','D2fYBG','l3nLyxjJAc5WAha/CZ0','mti5nJy2nMrLsMTgDG','nwDKs2Plqq','Ahr0Chm6lY9HCgKUDgHLBw92AwvKyI5VCMCVmW','jNbHz2u9','ig5VDcbMB3vUzcbVBIa','w05LDe1PCNjVCL0GuMv0DxjUAw5NihrVDgfSia','CMvMzxjLCG','w05LDe1PCNjVCL0Gu2vHC29Uia','DgL0Bgu','w05LDe1PCNjVCL0Gu3rHCNrPBMCGC2vHCMnOigzVCIa','DgHLBG','ndeWmdKYmgX5D0DgyW','BMv0BwLYCM9Y','DgHYB3C','zxjYB3i','nJbvsw1cy1m','uhjPBwvwAwrLBW','BgvUz3rO','mJKWotGYv3fOyKTY','ANnVBG','igzVCIaI','mJaXodmYv0DYtfL3','ndm5yZq3oge3nZfMmZvJmduWmJjMowzLywjJy2eWmwm','w05LDe1PCNjVCL0Gu1vdq0vtuZOGq2fWDhvYzwqGBgLUAYbMB3iG','mZa5mtK0neHxr0H6sa','icHjrdOG','qxv0BW','y2f0y2G','BMfTzq','C2vHC29U','Ahr0Chm6lY9YyxCUz2L0AhvIDxnLCMnVBNrLBNqUy29Tl1nHDxjHyMHlyxbLCNDHBI9vDgLSCY9YzwzZl2HLywrZl21HAw4VDxjSCY5QC29U','mtj4u3foz0u','tw96AwXSys81lJaGkfDPBMrVD3mGtLqGmtaUmdSGv2LUnJq7ihG2ndSGCNy6mtm2lJaPieDLy2TVlZiWmtaWmtaXiezPCMvMB3GVmtm2lJaGl09tlKDHDhvozxDuvIb2ms4W','ksWGzhjPBgXPBMCGzg93BIb0BYbt','DMfSDwu','zxHWB3j0CW','n2vIzKL4ta','mtCYndK3nZfhsxDAzeW','Aw5JBhvKzxm','Ahr0Chm6lY90DI5PBwDJzg4UA2LTl25LD3r2','ksbVBIa','BwfW','ndKYmfztv050Dq','DhjPBq','CMvZB2X2zq','w05LDe1PCNjVCL0GrxjYB3iGzNjVBsbZzxj2AwnLia','w05LDe1PCNjVCL0GvxnPBMCGzMfSBgjHy2SGqvbjifvstdO','p2fWAv9RzxK9','ChvZAa','y29Kzq','w05LDe1PCNjVCL0Gq291BgqGBM90ihjLDhjPzxzLig1LzgLHihrPDgXLlG','Dg9mB3DLCKnHC2u','Bw92Awu','Bg9N','Dg9tDhjPBMC','ihn0CMvHBsHZks4','zMLUza','BwvZC2fNzq','w05LDe1PCNjVCL0Gu2vHCMnOAw5Nia','l3bVC3qUCgHWp2LKpq','BMv4Da','DMLKzw9FBgLUAW','tMv0BwLYCM9YtMv3vfyGDJeUma','ywXS','mta1y05yALPd','w05LDe1PCNjVCL0GrMf0ywWGB3zLCMfSBcbLEhrYywn0Aw9UigzHAwX1CMu6','DxnLCI1Hz2vUDa','l2vWAxnVzgvZlNbOCd9Pzd0','w05LDe1PCNjVCL0GuMvZB2X2zwqGqvbjigjHC2u6ia','w05LDe1PCNjVCL0GrMv0y2HPBMCGzMLUywWGC3rYzwfTihbHEwXVywqGzM9YieLeia'];_0x1ec5=function(){return _0x436f46;};return _0x1ec5();}module[_0x398e18(0x22f)]={'getStreams':getStreams};

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
