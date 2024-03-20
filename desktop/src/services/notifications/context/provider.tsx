// Third Party Imports
import { createSignal } from "solid-js";

// Local Imports
import { NotificationsContext } from "./create-context";
import { NotificationsProviderProps } from "../index.types";

export function NotificationsProvider(props: NotificationsProviderProps) {
  //
  // State
  //

  const [notification, setNotification] = createSignal<string | undefined>(
    undefined,
  );

  return (
    <NotificationsContext.Provider value={[notification, setNotification]}>
      {props.children}
    </NotificationsContext.Provider>
  );
}
