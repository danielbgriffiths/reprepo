// Third Party Imports
import Icon from "solid-fa";
import { styled } from "solid-styled-components";
import { DropdownMenu, Image } from "@kobalte/core";

// Local Imports
import { authCommands } from "@services/commands";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { useAuth } from "@services/auth";
import { useStronghold } from "@services/stronghold";
import { useToast, ToastKey } from "@services/toast";

export interface SideBarProps {}

export function SideBar(_props: SideBarProps) {
  //
  // Hooks
  //

  const auth = useAuth();
  const stronghold = useStronghold();
  const toast = useToast();

  //
  // Event Handlers
  //

  async function onClickLogout(): Promise<void> {
    const isLogoutSuccessful = await authCommands.logout({
      authId: auth.store.auth!.id,
      accountId: auth.store.localAccountId,
    });

    if (!isLogoutSuccessful) {
      return toast.register(ToastKey.LogoutError);
    }

    auth.setAuth(undefined);

    await stronghold.remove(StrongholdKeys.AuthedSignature, { save: true });

    toast.register(ToastKey.Logout);
  }

  return (
    <Styled.Container>
      <Image.Root fallbackDelay={600}>
        <Image.Img src="/logo.png" alt="logo" />
        <Image.Fallback>NS</Image.Fallback>
      </Image.Root>

      <Styled.List>
        {config.navItems.map((item) => (
          <Styled.ListItem>
            <Link variant={LinkVariant.NavItem} href={item.path}>
              <Styled.ListItemIcon icon={item.icon} />
              {item.name}
            </Link>
          </Styled.ListItem>
        ))}
      </Styled.List>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Image.Root fallbackDelay={600}>
            <Image.Img
              src={auth.store.user?.avatar}
              alt={`${auth.store.user?.firstName} settings menu`}
            />
            <Image.Fallback>NS</Image.Fallback>
          </Image.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content>
            <DropdownMenu.Item onClick={onClickLogout}>
              Logout <div class="dropdown-menu__item-right-slot">⌘+K</div>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
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
