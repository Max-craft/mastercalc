const CACHE_NAME = 'network-consumption-calculator-cache-v1';
const urlsToCache = [
  '/',            // الصفحة الرئيسية
  '/index.html',   // صفحة الـ HTML
  '/manifest.json' // ملف الـ Manifest
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.all(urlsToCache.map(url => {
          return fetch(url)
            .then(response => {
              if (response.ok) {
                return cache.put(url, response);
              } else {
                console.log('فشل في تحميل الملف:', url);
              }
            })
            .catch(error => {
              console.error('خطأ أثناء تحميل الملف:', url, error);
            });
        }));
      })
      .then(() => {
        console.log('تم تخزين جميع الملفات بنجاح');
      })
      .catch((error) => {
        console.error('حدث خطأ أثناء تخزين الملفات:', error);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);  // حذف الكاشات القديمة
          }
        })
      );
    })
  );
});

// التعامل مع الطلبات الموجهة للموقع
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);  // إذا لم يكن موجودًا في الكاش، يتم تحميله من السيرفر
      })
  );
});
