import api from "../lib/api";

/**
 * Convert base64 VAPID public key to Uint8Array for PushManager
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Check if Web Push & Service Workers are supported in the current browser
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

/**
 * Get current browser notification permission state
 */
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isPushNotificationSupported()) return "unsupported";
  return Notification.permission;
}

/**
 * Register EstateGold Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushNotificationSupported()) return null;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    return registration;
  } catch (err) {
    console.error("[SW_REGISTER_ERROR]", err);
    return null;
  }
}

/**
 * Request notification permission and subscribe this browser/device to Web Push
 */
export async function subscribeToPush(): Promise<{
  success: boolean;
  permission: NotificationPermission | "unsupported";
  message?: string;
}> {
  if (!isPushNotificationSupported()) {
    return {
      success: false,
      permission: "unsupported",
      message: "Browser notifications are not supported on this device.",
    };
  }

  try {
    // 1. Request browser permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return {
        success: false,
        permission,
        message:
          permission === "denied"
            ? "Notifications are blocked in your browser settings. Please enable them to receive real-time alerts."
            : "Notification permission was not granted.",
      };
    }

    // 2. Register Service Worker
    const registration = await registerServiceWorker();
    if (!registration) {
      return {
        success: false,
        permission: "granted",
        message: "Failed to initialize device service worker.",
      };
    }

    // 3. Obtain VAPID Public Key from Backend
    const keyRes = await api.get("/notifications/push/vapid-public-key");
    const vapidPublicKey = keyRes.data?.publicKey;
    if (!vapidPublicKey) {
      throw new Error("VAPID public key not available from server.");
    }

    // 4. Create or renew browser PushSubscription with current server key
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      try {
        await subscription.unsubscribe();
      } catch (e) {
        // Continue to fresh subscribe
      }
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey as unknown as ArrayBuffer,
    });

    // 5. Send subscription details to backend
    const subJSON = subscription.toJSON();
    await api.post("/notifications/push/subscribe", {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subJSON.keys?.p256dh,
        auth: subJSON.keys?.auth,
      },
      subscription: {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subJSON.keys?.p256dh,
          auth: subJSON.keys?.auth,
        },
      },
      userAgent: navigator.userAgent,
    });

    return {
      success: true,
      permission: "granted",
      message: "Push notifications successfully enabled for this device!",
    };
  } catch (err: any) {
    console.error("[PUSH_SUBSCRIBE_FLOW_ERROR]", err);
    return {
      success: false,
      permission: getNotificationPermission(),
      message: err.response?.data?.message || err.message || "Failed to enable push notifications.",
    };
  }
}

/**
 * Unsubscribe this browser/device from Web Push
 */
export async function unsubscribeFromPush(): Promise<{ success: boolean; message?: string }> {
  if (!isPushNotificationSupported()) return { success: true };

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      const endpoint = subscription.endpoint;
      await subscription.unsubscribe();

      // Deactivate on backend
      await api.delete("/notifications/push/unsubscribe", {
        data: { endpoint },
      });
    }

    return { success: true, message: "Device unsubscribed from push notifications." };
  } catch (err: any) {
    console.error("[PUSH_UNSUBSCRIBE_ERROR]", err);
    return { success: false, message: err.message };
  }
}

/**
 * Auto-sync existing permission:
 * If user already granted permission earlier, ensure service worker is active and subscription is registered.
 */
export async function syncPushIfGranted(): Promise<void> {
  if (!isPushNotificationSupported()) return;
  if (Notification.permission === "granted") {
    try {
      await subscribeToPush();
    } catch (e) {
      // Quiet fail in background
    }
  }
}
