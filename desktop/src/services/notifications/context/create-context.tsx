// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { NotificationsBindings } from "../index.types";

export const NotificationsContext = createContext<NotificationsBindings>([
  () => [],
  {
    addNotification: () => {},
    removeNotification: () => {},
  },
]);
