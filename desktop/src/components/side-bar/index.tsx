// Local Imports
import { cmd } from "@services/commands/index.utils";
import { Commands } from "@services/commands";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { useAuth } from "@services/auth";
import { useStronghold } from "@services/stronghold";
import { useNavigate } from "@solidjs/router";
import { useNotifications } from "@services/notifications";

export interface SideBarProps {}

export function SideBar(_props: SideBarProps) {
  //
  // Hooks
  //

  const [activeUser, setActiveUser] = useAuth();
  const stronghold = useStronghold();
  const navigate = useNavigate();
  const [_, notificationActions] = useNotifications();

  //
  // Event Handlers
  //

  async function onClickLogout(): Promise<void> {
    const logoutResult = await cmd<boolean>(Commands.Logout, {
      userId: activeUser()!.id,
    });

    if (logoutResult.error) {
      notificationActions.addNotification({
        message: <span>{logoutResult.error.message}</span>,
        type: "error",
        duration: 5000,
        isRemovableByClick: true,
      });
      return;
    }

    setActiveUser(undefined);
    await stronghold.remove(StrongholdKeys.AuthedSignature);
    await stronghold.save();
    navigate("/", { replace: true });
  }

  return (
    <div class="secondary-container">
      <img class="primary-logo" alt="logo" src="../../assets/logo.svg" />

      <div class="primary-side-bar">
        <ul class="primary-navigation menu bg-base-400 text-base-content border-r border-r-solid border-r-base-200">
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
        </ul>
      </div>
      <div class="secondary-side-bar"></div>
    </div>
  );
}
