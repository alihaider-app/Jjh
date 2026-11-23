/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "standalone-index.html",
    "revision": "6fc9bfbf31cba7b378d8968d12f1cb5b"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "6c167d8521e159411f2de7818ad981d9"
  }, {
    "url": "pwa-512x512.png",
    "revision": "059bd42b139d35dcd76ac896f7f29077"
  }, {
    "url": "pwa-192x192.png",
    "revision": "269e71cda4cb9ed2fe19cb2c8ad468b3"
  }, {
    "url": "index.html",
    "revision": "dcd433a5bdfc8a015df0f7a5b1227cac"
  }, {
    "url": "icon.svg",
    "revision": "12d9bfe9feac2aeac5a63c56790115a0"
  }, {
    "url": "favicon.ico",
    "revision": "b9a4328ff8b1034d0580bdb7d9625cb3"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "59c776b4bea2330d025a9ca10e1a16f2"
  }, {
    "url": "ai-agent-ali.html",
    "revision": "6fc9bfbf31cba7b378d8968d12f1cb5b"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/index-Dmj7bj46.js",
    "revision": null
  }, {
    "url": "assets/index-BoWUzjyF.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "59c776b4bea2330d025a9ca10e1a16f2"
  }, {
    "url": "favicon.ico",
    "revision": "b9a4328ff8b1034d0580bdb7d9625cb3"
  }, {
    "url": "icon.svg",
    "revision": "12d9bfe9feac2aeac5a63c56790115a0"
  }, {
    "url": "pwa-192x192.png",
    "revision": "269e71cda4cb9ed2fe19cb2c8ad468b3"
  }, {
    "url": "pwa-512x512.png",
    "revision": "059bd42b139d35dcd76ac896f7f29077"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "6c167d8521e159411f2de7818ad981d9"
  }, {
    "url": "manifest.webmanifest",
    "revision": "172acd40165ee4d0327f9c804344e113"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
