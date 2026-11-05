// PumpOps questions — the service worker: shows each push, and opens the page when it is tapped.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))
self.addEventListener('push', e => {
  let d = {}
  try { d = e.data ? e.data.json() : {} } catch { d = { title: 'PumpOps', body: e.data ? e.data.text() : '' } }
  e.waitUntil(self.registration.showNotification(d.title || 'PumpOps', { body: d.body || '', tag: d.id ? String(d.id) : undefined, icon: '../icon-192.png', data: { id: d.id } }))
})
self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    // a Management push (id -1, W141) opens the Management tab
    const manage = e.notification.data && e.notification.data.id === -1
    if (all.length) { await all[0].focus(); all[0].postMessage({ refresh: true, view: manage ? 'manage' : null }); return }
    await self.clients.openWindow(manage ? './?view=manage' : './')
  })())
})
