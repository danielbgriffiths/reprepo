// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { Toast, ToastBindings, ToastKey } from "../index.types";

export const ToastContext = createContext<ToastBindings>({
  register: (_key: ToastKey, _overrides?: Partial<Toast>) => {},
});
