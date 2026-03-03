const CACHE_NAME = 'vacation-system-v1'; // غير v1 إلى v2 عند الرغبة في تحديث الكاش
const urlsToCache = [
  '/',
  'index.html', // تأكد أن اسم ملف الـ HTML هو index.html
];

// تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// تفعيل النسخة الجديدة وحذف الكاش القديم
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// استراتيجية الشبكة أولاً (Network First) لأن تطبيقك يعتمد على رابط خارجي
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});