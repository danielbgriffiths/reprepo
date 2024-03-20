// Third Party Imports
import { useContext } from "solid-js";

// Local Imports
import { NotificationsContext } from "./create-context";
import { NotificationsBindings } from "../index.types";

export function useNotifications(): NotificationsBindings {
  return useContext(NotificationsContext);
}
