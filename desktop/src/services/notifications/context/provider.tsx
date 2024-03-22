// Third Party Imports
import { createSignal } from "solid-js";

// Local Imports
import { NotificationsContext } from "./create-context";
import {
  NotificationsBindings,
  NotificationsProviderProps,
  Notification,
} from "../index.types";

export function NotificationsProvider(props: NotificationsProviderProps) {
  //
  // State
  //

  const [notifications, setNotifications] = createSignal<Notification[]>([]);

  //
  // Functions
  //

  function addNotification(notification: Notification): void {
    const notificationUid: number = Date.now();

    const nextNotification = { ...notification, uid: notificationUid };

    setNotifications((previousNotifications) => [
      ...previousNotifications,
      nextNotification,
    ]);

    setTimeout(() => {
      removeNotification(nextNotification);
    }, notification.duration);
  }

  function removeNotification(notification: Notification): void {
    setNotifications((previousNotifications) =>
      previousNotifications.filter(
        (previousNotification) => previousNotification.uid !== notification.uid,
      ),
    );
  }

  const notificationsBindings: NotificationsBindings = [
    notifications,
    {
      addNotification,
      removeNotification,
    },
  ];

  return (
    <NotificationsContext.Provider value={notificationsBindings}>
      {props.children}
    </NotificationsContext.Provider>
  );
}
