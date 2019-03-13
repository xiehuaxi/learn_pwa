var cacheName = 'sw-1-0-0';
var cacheFiles = [
  './index.html',
  './index.js',
  './style.css',
  './img/book.png',
  './img/loading.svg'
]

// self.addEventListener('install', function(e) {
//   var cacheOpenPromise = caches.open(cacheName).then(function(cache) {
//     return cache.addAll(cacheFiles);
//   })
  /**
   *  因为oninstall和onactivate完成前需要一些时间，
   *  service worker标准提供一个waitUntil方法，
   *  当oninstall或者onactivate触发时被调用，
   *  接受一个promise。在这个 promise被成功resolve以前，功能性事件不会分发到service worker。
   */
//   e.waitUntil(cacheOpenPromise);
// })
self.addEventListener('install', function (e) {
  console.log('Service Worker 状态： install');
  var cacheOpenPromise = caches.open(cacheName).then(function (cache) {
      return cache.addAll(cacheFiles);
  }).catch(function(err) {
    console.log(err, 123456)
  });
  e.waitUntil(cacheOpenPromise);
});

self.addEventListener('activate', function (e) {
  console.log('Service Worker 状态： activate');
  var cachePromise = caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
          if (key !== cacheName) {
              return caches.delete(key);
          }
      }));
  })
  e.waitUntil(cachePromise);
  return self.clients.claim();
});


self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cache) {
      return cache || fetch(e.request);
    }).catch(function(err) {
      console('fetch err => '+err);
      return fetch(e.request);
    })
  )
})