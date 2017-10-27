self.addEventListener('install', (event) =>  {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
          return cache.addAll(
            [
              'web/css/animate.css',
              'web/css/style.css',
              'web/css/theme.css',
              '/index.html',
              'web/js/'
            ]
          );
        })
      );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


self.addEventListener('activate', (event) =>  {
//do stuff during activation
});
