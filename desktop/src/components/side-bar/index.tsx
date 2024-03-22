import { styled } from "solid-styled-components";

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
    <Styled.Container>
      <Styled.LogoContainer>
        <Styled.Logo alt="logo" src="../../assets/logo.svg" />
      </Styled.LogoContainer>

      <Styled.List>
        {[
          { name: "Overview", path: "/overview" },
          { name: "Add Record", path: "/add-record" },
        ].map((item) => (
          <Styled.ListItem>
            <Styled.LinkTo href={item.path}>{item.name}</Styled.LinkTo>
          </Styled.ListItem>
        ))}
      </Styled.List>

      <Styled.AvatarContainer>
        <Styled.Avatar alt="avatar" src="" />
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
  AvatarContainer: styled.div``,
  Avatar: styled.img``,
  SecondaryLinkTo: styled.a``,
};
