// PumpOps alerts — the service worker: shows each push, and opens the page on the message when it is tapped.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))
self.addEventListener('push', e => {
  let d = {}
  try { d = e.data ? e.data.json() : {} } catch { d = { title: 'PumpOps', body: e.data ? e.data.text() : '' } }
  e.waitUntil(self.registration.showNotification(d.title || 'PumpOps', { body: d.body || '', tag: d.id ? String(d.id) : undefined, data: { id: d.id || null }, silent: !!d.silent, icon: 'icon-192.png', badge: 'icon-192.png' }))
})
self.addEventListener('notificationclick', e => {
  e.notification.close()
  const id = e.notification.data && e.notification.data.id
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    if (all.length) { await all[0].focus(); if (id) all[0].postMessage({ open: id }); return }
    await self.clients.openWindow(id ? `./?m=${id}` : './')
  })())
})
