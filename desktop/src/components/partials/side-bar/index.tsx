// Third Party Imports
import { createSignal } from "solid-js";

// Local Imports
import * as Styled from "./index.styled";
import { cmd } from "@services/commands/index.utils.ts";
import { Commands } from "@services/commands";
import { StrongholdKeys } from "@services/stronghold/index.config.ts";
import { useAuth } from "@services/auth";
import { useStronghold } from "@services/stronghold";
import { useNavigate } from "@solidjs/router";
import { LinkButton } from "@services/styled";

export interface SideBarProps {}

export function SideBar(_props: SideBarProps) {
  //
  // Hooks
  //

  const [activeUser, setActiveUser] = useAuth();
  const stronghold = useStronghold();
  const navigate = useNavigate();

  //
  // State
  //
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
    <Styled.Wrapper>
      {logoutError() && logoutError()}
      <LinkButton onClick={onClickLogout}>Logout</LinkButton>
    </Styled.Wrapper>
  );
}
