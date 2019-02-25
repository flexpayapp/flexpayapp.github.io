var cacheName = 'fp-v1';
var cacheFiles = [
    './',
    './css/answer.css',
    './css/bootstrap-datepicker.min.css',
    './css/bootstrap.css',
    './css/style.css',
    './css/index.css',
    './images/calca.png',
    './images/camiseta.png',
    './images/cesta.png',
    './images/ingresso.png',
    './images/lanche.png',
    './images/pizza.png',
    './images/sneakers.png',
    './images/tray.png',
    './images/icon.ico',
    './images/calendar.png',
    './images/bg.jpeg',
    './js/app-answer.js',
    './js/app.js',
    './js/app-juros.js',
    './js/atualiza-parcelas.js',
    './js/bootstrap-datepicker.min.js',
    './js/bootstrap.js',
    './js/jquery-3.3.1.slim.min.js',
    './js/popper.min.js',    
    './index.html',
    './inputs.html',
    './inputs2.html',
    './manifest.json'
];

self.addEventListener('install',function(e){
    console.log("[Service Worker] Installed")

    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log("[Service Worker] Caching cacheFiles");
            return cache.addAll(cacheFiles); //coloca em cache os arquivos definidos em cacheFiles
        })
    )
})
self.addEventListener('activate',function(e){
    console.log("[Service Worker] Activated")
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(cacheNames.map(function(thisCacheName) {// atualiza o cache
                if(thisCacheName !== cacheName){
                    console.log("[Service Worker] Removing Cached Files from",thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }))
        })
    )
})
self.addEventListener('fetch',function(e){
    console.log("[Service Worker] Fetching",e.request.url);

    e.respondWith(
        caches.match(e.request).then(function(response){
            if(response){
                console.log("[Service Worker] Found in cache",e.request.url);
                return response;
            }
            var requestClone = e.request.clone();
            
            fetch(requestClone)
                .then(function(reponse){
                    if(!response){
                        console.log("[Service Worker] No response from fetch");
                        return response;
                    }
                    var responseClone = response.clone();
                    caches.open(cacheName).then(function(cache){
                        console.log("[Service Worker] New data",e.request.url);
                        cache.put(e.request,responseClone);
                        return response;
                    });
                })
                .catch(function(err){
                    console.log("[Service Worker] Error fetching and caching new data");
                })
        })
    )
})