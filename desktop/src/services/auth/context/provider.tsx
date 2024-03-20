// Third Party Imports
import { createSignal } from "solid-js";

// Local Imports
import { AuthContext } from "./create-context.tsx";
import { AuthProviderProps } from "../index.types.ts";
import { UserSummary } from "@/models";

export function AuthProvider(props: AuthProviderProps) {
  //
  // State
  //

  const [activeUser, setActiveUser] = createSignal<UserSummary | undefined>(
    undefined,
  );

  return (
    <AuthContext.Provider value={[activeUser, setActiveUser]}>
      {props.children}
    </AuthContext.Provider>
  );
}
