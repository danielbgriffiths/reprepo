// Third Party Imports
import { createSignal } from "solid-js";

// Local Imports
import { AuthContext } from "./create-context";
import { AuthBindings, AuthProviderProps } from "../index.types";
import { UserSummary } from "@/models";

export function AuthProvider(props: AuthProviderProps) {
  //
  // State
  //

  const [activeUser, setActiveUser] = createSignal<UserSummary | undefined>(
    undefined,
  );

  const authBindings: AuthBindings = [activeUser, { setActiveUser }];

  return (
    <AuthContext.Provider value={authBindings}>
      {props.children}
    </AuthContext.Provider>
  );
}
