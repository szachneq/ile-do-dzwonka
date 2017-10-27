self.addEventListener('install', (event) =>  {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
          return cache.addAll(
            [
<<<<<<< HEAD
              '/web/css/animate.css',
              '/web/css/style.css',
              '/web/css/theme.css',
              '/index.html',
              '/web/js/'
=======
              'web/css/animate.css',
              'web/css/style.css',
              'web/css/theme.css',
              '/index.html',
              'web/js/'
>>>>>>> 33120136d1989f1b61e4c0979213341ff98da1a3
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
