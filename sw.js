var C="darts-v2";
var FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES);}));self.skipWaiting();});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C;}).map(function(x){return caches.delete(x);}));}));self.clients.claim();});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  // rete prima (così prendi sempre l'ultima versione), copia salvata se sei offline
  e.respondWith(fetch(e.request).then(function(r){var cp=r.clone();if(r.ok&&new URL(e.request.url).origin===location.origin)caches.open(C).then(function(c){c.put(e.request,cp);});return r;})
    .catch(function(){return caches.match(e.request).then(function(r){return r||caches.match("index.html");});}));
});
