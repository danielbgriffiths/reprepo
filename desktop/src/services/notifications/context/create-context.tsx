// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { NotificationKey, NotificationsBindings } from "../index.types";

export const NotificationsContext = createContext<NotificationsBindings>({
  store: {
    notifications: [],
  },
  register: (_key: NotificationKey) => undefined,
  deregister: (_uid: number) => undefined,
});
