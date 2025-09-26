self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('theme-builder-cache').then(cache => {
      return cache.addAll([
        './',
        '../index.html',
        './manifest.json',
        '../asset/PBiThemeBuilder.png',
        'https://raw.githubusercontent.com/microsoft/powerbi-desktop-samples/refs/heads/main/Report%20Theme%20JSON%20Schema/reportThemeSchema-2.114.json'
      ]);
    }).catch(error => {
      console.error('Caching failed:', error);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});