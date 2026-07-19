/*! coi-serviceworker v0.1.7 - Guido Zuidhof, licensed under MIT */
if (typeof window === 'undefined') {
  self.addEventListener('install', () => self.skipWaiting())
  self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'deregister') {
      self.registration
        .unregister()
        .then(() => self.clients.matchAll())
        .then((clients) => {
          clients.forEach((client) => client.navigate(client.url))
        })
    }
  })
  self.addEventListener('fetch', function (event) {
    if (
      event.request.cache === 'only-if-cached' &&
      event.request.mode !== 'same-origin'
    ) {
      return
    }
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 0) {
            return response
          }
          const newHeaders = new Headers(response.headers)
          newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp')
          newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin')
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          })
        })
        .catch((e) => console.error(e)),
    )
  })
} else {
  ;(async () => {
    if (window.crossOriginIsolated) return
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      if (!window.crossOriginIsolated) {
        console.log('Reloading to activate cross-origin isolation')
        window.sessionStorage.setItem('coiReloadedBySelf', 'true')
        window.location.reload()
      } else if (registration.active) {
        registration.unregister().then(() => {
          console.log('Cross-origin isolation active, service worker unregistered')
        })
      }
      return
    }
    if (window.sessionStorage.getItem('coiReloadedBySelf')) {
      console.error('Cross-origin isolation not available after reload')
      return
    }
    try {
      await navigator.serviceWorker.register(window.document.currentScript.src)
      console.log('COI service worker registered, reloading')
      window.sessionStorage.setItem('coiReloadedBySelf', 'true')
      window.location.reload()
    } catch (err) {
      console.error('COI service worker registration failed:', err)
    }
  })()
}
