// اسم الكاش - قم بتغيير v1 إلى v2 أو أي رقم جديد عند الرغبة في إجبار التطبيق على التحديث
const CACHE_NAME = 'bbr-corner-cache-v2';

// الملفات التي سيتم تخزينها للعمل أوفلاين ولتحسين السرعة
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// مرحلة التثبيت (Install): يتم فيها فتح الكاش وتخزين الملفات المذكورة أعلاه
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and adding assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // إجبار الـ Service Worker الجديد على التفعيل فوراً
  );
});

// مرحلة التفعيل (Activate): هنا يتم مسح أي كاش قديم لا يطابق الاسم الحالي (CACHE_NAME)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache...', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // البدء في التحكم في الصفحات المفتوحة فوراً
  );
});

// استراتيجية جلب البيانات (Fetch): "الشبكة أولاً" (Network First)
// نقوم بمحاولة جلب البيانات من الإنترنت أولاً (لتحديث البيانات دائماً)، وإذا فشل (أوفلاين) نستخدم الكاش
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

