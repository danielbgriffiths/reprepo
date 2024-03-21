// Third Party Imports
import { createSignal } from "solid-js";

// Local Imports
import { cmd } from "@services/commands/index.utils";
import { Commands } from "@services/commands";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { useAuth } from "@services/auth";
import { useStronghold } from "@services/stronghold";
import { useNavigate } from "@solidjs/router";
import { SideBarDisplay } from "./SideBarDisplay";

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
    <SideBarDisplay>
      <>
        <div class="avatar">
          <div class="w-24 rounded">
            <img alt="Logo" src="../../../../public/logo.png" />
          </div>
        </div>
        <li>
          <a>Sidebar Item 1</a>
        </li>
        <li>
          <a>Sidebar Item 2</a>
        </li>
        <div>
          <img alt="avatar" src="" />
          <a onClick={onClickLogout}>Logout</a>
        </div>
      </>
    </SideBarDisplay>
  );
}
