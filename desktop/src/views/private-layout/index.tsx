// Third Party Imports
import { children, createSignal } from "solid-js";
import { RouteSectionProps, useNavigate } from "@solidjs/router";

// Local Imports
import { LinkButton } from "@services/styled";
import { useAuth } from "@services/auth";
import { Commands } from "@services/commands";
import { useStronghold } from "@services/stronghold";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { cmd } from "@services/commands/index.utils";

interface PrivateLayoutProps extends RouteSectionProps {}

export default function PrivateLayout(props: PrivateLayoutProps) {
  //
  // Hooks
  //

  const [activeUser, setActiveUser] = useAuth();
  const stronghold = useStronghold();
  const navigate = useNavigate();

  //
  // State
  //

  const c = children(() => props.children);
  const [logoutError, setLogoutError] = createSignal<string | undefined>();

  //
  // Event Handlers
  //

  async function onClickLogout(): Promise<void> {
    const logoutResult = await cmd<boolean>(Commands.Logout, {
      userId: activeUser()!.id,
    });

    if (logoutResult.error) {
      setLogoutError(logoutResult.error.message);
      return;
    }

    setActiveUser(undefined);
    await stronghold.remove(StrongholdKeys.AuthedSignature);
    await stronghold.save();
    navigate("/", { replace: true });
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
