/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

// Alarm Listener
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_ALARM') {
    const { taskId, title, body, fireAt } = event.data;
    const delay = fireAt - Date.now();
    
    // Safety: ignore if fire time is already past
    if (delay <= 0) return;

    // Use setTimeout in the SW to trigger the notification
    // While SW can be terminated, they are more persistent than tabs
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: taskId,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        data: { taskId }
      });
    }, delay);
  }
});
