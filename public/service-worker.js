const STATIC_CACHE_NAME = "static-version-1";
const DYNAMIC_CACHE_NAME = "dynamic-version-1";

const staticFiles = [
    'index.html',
    'scripts/app.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
    'manifest.json',
    'pages/fallback.html'
];

self.addEventListener("install", (event) => {
    console.log("Service worker installed: ", event);

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            console.log("Caching static files.");
            cache.addAll(staticFiles);
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("Service worker activated: ", event);

    event.waitUntil(
        caches.keys().then(keys => {
            console.log("Cache keys: ", keys);

            return Promise.all(                
                keys.filter(key => ((key !== STATIC_CACHE_NAME) && (key !== DYNAMIC_CACHE_NAME)))                
                .map(key => caches.delete(key))
            )
        })
    );
});

self.addEventListener("fetch", (event) => {
    console.log("Fetch event: ", event);

    event.respondWith(
        caches.match(event.request).then(cacheResponse => {
            return cacheResponse || fetch(event.request).then(fetchResponse => {
                return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
                    cache.put(event.request.url, fetchResponse.clone());
                    return fetchResponse;
                })
            })           
            .catch(() => {
                if(event.request.url.indexOf('.html') >= 0)
                    return caches.match('pages/fallback.html');
            });
        })
    );
});

self.addEventListener('notificationclick', event => {
    console.log("Notification clicked.");

});

self.addEventListener('notificationclose', event => {
    console.log("Notification closed.");

});

self.addEventListener("push", event => {
    console.log("Push-bericht ontvangen...");

    event.waitUntil(
        self.registration.showNotification(event.data.text())
    );
});