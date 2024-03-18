// Third Party Imports
import { children, createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api";
import { RouteSectionProps } from "@solidjs/router";

// Local Imports
import { LinkButton } from "@services/styled";
import { useAuth } from "@services/auth";
import { Commands, InvokeResult } from "@services/commands";
import { useStronghold } from "@services/stronghold";
import { StrongholdKeys } from "@services/stronghold/index.config.ts";

interface PrivateLayoutProps extends RouteSectionProps {}

export default function PrivateLayout(props: PrivateLayoutProps) {
  //
  // Hooks
  //

  const auth = useAuth();
  const stronghold = useStronghold();

  //
  // State
  //

  const c = children(() => props.children);
  const [logoutError, setLogoutError] = createSignal<string | undefined>();

  //
  // Event Handlers
  //

  async function onClickLogout(): Promise<void> {
    const logoutResult = await invoke<InvokeResult<boolean>>(Commands.Logout, {
      userId: auth.activeUser()!.id,
    });

    if (logoutResult.data) {
      auth.setActiveUser(undefined);
      await stronghold.remove(StrongholdKeys.AuthedSignature);
      return;
    }

    setLogoutError(logoutResult.error.message);
  }

  return (
    <div>
      <LinkButton onClick={onClickLogout}>Logout</LinkButton>
      <h1>Private Layout</h1>
      <div>{logoutError() && <p>{logoutError()}</p>}</div>
      {c()}
    </div>
  );
}
