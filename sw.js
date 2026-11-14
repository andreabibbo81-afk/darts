var C="darts-v4";
var FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(FILES);}));self.skipWaiting();});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C;}).map(function(x){return caches.delete(x);}));}));self.clients.claim();});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  // rete prima (così prendi sempre l'ultima versione), copia salvata se sei offline
  var same=new URL(e.request.url).origin===location.origin;
  // per i file dell'app chiede sempre al server se c'è una versione nuova (niente copia vecchia della cache del browser)
  e.respondWith((same?fetch(e.request.url,{cache:"no-cache"}):fetch(e.request)).then(function(r){var cp=r.clone();if(r.ok&&new URL(e.request.url).origin===location.origin)caches.open(C).then(function(c){c.put(e.request,cp);});return r;})
    .catch(function(){return caches.match(e.request).then(function(r){return r||caches.match("index.html");});}));
});
