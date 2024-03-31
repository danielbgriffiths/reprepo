// Third Party Imports
import { createStore } from "solid-js/store";

// Local Imports
import { NotificationsContext } from "./create-context";
import {
  NotificationsBindings,
  NotificationsProviderProps,
  NotificationStore,
  NotificationKey,
  Notification,
} from "../index.types";
import { NOTIFICATION_MAP } from "@services/notifications/index.config.ts";

export function NotificationsProvider(props: NotificationsProviderProps) {
  //
  // State
  //

  const [store, setStore] = createStore<NotificationStore>({
    notifications: [],
  });

  //
  // Functions
  //

  function register(
    key: NotificationKey,
    overrides?: Partial<Notification>,
  ): void {
    const notificationUid: number = Date.now();

    const nextNotification: Notification = {
      ...(NOTIFICATION_MAP[key] ?? {}),
      ...overrides,
      uid: notificationUid,
    };

    setStore((prevStore) => ({
      notifications: [...prevStore.notifications, nextNotification],
    }));

    setTimeout(() => {
      deregister(nextNotification.uid!);
    }, nextNotification.duration);
  }

  function deregister(uid: number): void {
    setStore((prevStore) => ({
      notifications: prevStore.notifications.filter(
        (previousNotification) => previousNotification.uid !== uid,
      ),
    }));
  }

  //
  // Lifecycle
  //

  const notificationsBindings: NotificationsBindings = {
    store,
    register,
    deregister,
  };

  return (
    <NotificationsContext.Provider value={notificationsBindings}>
      {props.children}
    </NotificationsContext.Provider>
  );
}
