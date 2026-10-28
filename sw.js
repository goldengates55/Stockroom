/* Stockroom service worker: keeps the app files on the phone so it opens with no internet.
   Change VERSION whenever you upload a new index.html so phones pick up the update. */
var VERSION = "goldengates-49";
var FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(function (hit) {
    var net = fetch(e.request).then(function (r) { if (r && (r.ok || r.type === "opaque")) { var cp = r.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, cp); }); } return r; }).catch(function () { return hit; });
    return hit || net;
  }));
});
