// Third Party Imports
import Icon from "solid-fa";
import { styled } from "solid-styled-components";
import {
  faGrid2Plus,
  faGridHorizontal,
  faNetworkWired,
} from "@fortawesome/pro-light-svg-icons";

// Local Imports
import { authCommands } from "@services/commands";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { useAuth } from "@services/auth";
import { useStronghold } from "@services/stronghold";
import { useNotifications } from "@services/notifications";
import { useData } from "@services/data";
import { NotificationKey } from "@services/notifications/index.types.ts";

export interface SideBarProps {}

export function SideBar(_props: SideBarProps) {
  //
  // Hooks
  //

  const auth = useAuth();
  const stronghold = useStronghold();
  const notifications = useNotifications();
  const data = useData();

  //
  // Event Handlers
  //

  async function onClickLogout(): Promise<void> {
    const isLoggedOut = await authCommands.logout({
      authId: auth.store.auth!.id,
      accountId: data.general.store.accountId,
    });

    if (!isLoggedOut) {
      return notifications.register(NotificationKey.LogoutError);
    }

    auth.setAuth(undefined);

    await stronghold.remove(StrongholdKeys.AuthedSignature, { save: true });

    notifications.register(NotificationKey.Logout);
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
