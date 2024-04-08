// Third Party Imports
import { useContext } from "solid-js";

// Local Imports
import { ToastContext } from "./create-context";
import { ToastBindings } from "../index.types";

export function useToast(): ToastBindings {
  return useContext(ToastContext)!;
}
