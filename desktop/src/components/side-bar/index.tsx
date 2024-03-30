// Third Party Imports
import Icon from "solid-fa";
import { styled } from "solid-styled-components";
import {
  faGridHorizontal,
  faNetworkWired,
  faGrid2Plus,
} from "@fortawesome/pro-light-svg-icons";

// Local Imports
import { cmd } from "@services/commands/index.utils";
import { Commands } from "@services/commands";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { useAuth } from "@services/auth";
import { useStronghold } from "@services/stronghold";
import { useNotifications } from "@services/notifications";
import { useData } from "@services/data";

export interface SideBarProps {}

export function SideBar(_props: SideBarProps) {
  //
  // Hooks
  //

  const auth = useAuth();
  const stronghold = useStronghold();
  const [_, notificationActions] = useNotifications();
  const data = useData();

  //
  // Event Handlers
  //

  async function onClickLogout(): Promise<void> {
    const logoutResult = await cmd<boolean>(Commands.Logout, {
      authId: auth.store.auth!.id,
      accountId: data.general.store.accountId,
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

    auth.setAuth(undefined);
    await stronghold.remove(StrongholdKeys.AuthedSignature, { save: true });

    notificationActions.addNotification({
      message: "Successfully logged out",
      type: "info",
      duration: 2000,
      isRemovableByClick: true,
    });
  }

  return (
    <Styled.Container>
      <Styled.LogoContainer>
        <Styled.Logo alt="logo" src="/logo.png" />
      </Styled.LogoContainer>

      <Styled.List>
        {[
          { name: "Overview", path: "/overview", icon: faGridHorizontal },
          { name: "Connect", path: "/add-record", icon: faNetworkWired },
          {
            name: "Create Record",
            path: "/create-record",
            icon: faNetworkWired,
          },
          { name: "Addons", path: "/addons", icon: faGrid2Plus },
        ].map((item) => (
          <Styled.ListItem>
            <Styled.LinkTo href={item.path}>
              <Styled.ListItemIcon icon={item.icon} />
            </Styled.LinkTo>
          </Styled.ListItem>
        ))}
      </Styled.List>

      <Styled.AvatarContainer>
        <Styled.Avatar
          alt="avatar"
          src={auth.store.user?.avatar || "/avatar.png"}
        />
        <Styled.SecondaryLinkTo onClick={onClickLogout}>
          Logout
        </Styled.SecondaryLinkTo>
      </Styled.AvatarContainer>
    </Styled.Container>
  );
}

const Styled = {
  Container: styled.div``,
  LogoContainer: styled.div``,
  Logo: styled.img``,
  List: styled.ul``,
  ListItem: styled.li``,
  LinkTo: styled.a``,
  ListItemIcon: styled(Icon)``,
  AvatarContainer: styled.div``,
  Avatar: styled.img``,
  SecondaryLinkTo: styled.a``,
};
