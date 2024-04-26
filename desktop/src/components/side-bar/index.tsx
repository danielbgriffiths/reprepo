// Third Party Imports
import Icon from "solid-fa";
import { styled } from "solid-styled-components";
import { DropdownMenu, Image } from "@kobalte/core";
import { createMemo, createResource } from "solid-js";
import { faGrid } from "@fortawesome/pro-light-svg-icons";

// Local Imports
import { authCommands, repositoryCommands } from "@services/commands";
import { useAuth } from "@services/auth";
import { useStronghold } from "@services/stronghold";
import { ToastKey, useToast } from "@services/toast";
import { NavItem, navItems } from "./index.config";
import { BodyTextVariant, Text } from "@services/styles";
import { S3Image } from "@components/image/s3-image";
import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemAppend,
} from "@services/styles/components/dropdown";
import { StrongholdKeys } from "@services/stronghold/index.config";

export interface SideBarProps {}

export function SideBar(_props: SideBarProps) {
  //
  // Hooks
  //

  const auth = useAuth();
  const stronghold = useStronghold();
  const toast = useToast();

  //
  // State
  //
  const [repositories] = createResource(
    () => auth.store.user,
    async () => {
      if (!auth.store.user) return [];
      return await repositoryCommands.getRepositories({
        userId: auth.store.user?.id,
      });
    },
  );

  const formattedNavItems = createMemo<NavItem[]>(() => {
    return [
      ...(repositories() || []).map((repository) => ({
        name: repository.name,
        path: `/auth/repositories/${repository.id}`,
        icon: faGrid,
      })),
      ...navItems,
    ];
  });

  //
  // Event Handlers
  //

  async function onClickLogout(): Promise<void> {
    const isLogoutSuccessful = await authCommands.logout({
      authId: auth.store.auth!.id,
      accountId: auth.store.localAccountId,
    });

    if (!isLogoutSuccessful) {
      toast.register(ToastKey.LogoutError);
      return;
    }

    auth.setAuth(undefined);

    await stronghold.remove(StrongholdKeys.AuthedSignature, { save: true });

    toast.register(ToastKey.Logout);
  }

  return (
    <SideBarWrapper>
      <div>
        <SideBarTopSection>
          <LogoRoot fallbackDelay={600}>
            <LogoImg src="/logo.png" alt="logo" />
            <LogoFallback>RR</LogoFallback>
          </LogoRoot>
        </SideBarTopSection>

        <SideBarMiddleSection>
          <SideBarMenu>
            {formattedNavItems().map((item) => (
              <li>
                <SideMenuAnchorLink href={item.path}>
                  <SideMenuAnchorText variant={BodyTextVariant.CaptionText}>
                    <SideMenuIcon icon={item.icon} />
                    {item.name}
                  </SideMenuAnchorText>
                </SideMenuAnchorLink>
              </li>
            ))}
          </SideBarMenu>
        </SideBarMiddleSection>
      </div>

      <SideBarBottomSection>
        <DropdownMenu.Root overflowPadding={10} placement="top-start">
          <DropdownMenuTrigger>
            <S3Image filePath={auth.store.user?.avatar}>
              {(s3) => (
                <AvatarRoot fallbackDelay={600}>
                  <AvatarImg
                    src={s3.file()}
                    alt={`${auth.store.user?.firstName} settings menu`}
                  />
                  <AvatarFallback>NS</AvatarFallback>
                </AvatarRoot>
              )}
            </S3Image>
            <Text variant={BodyTextVariant.CaptionText}>
              {auth.store.user?.firstName}
            </Text>
          </DropdownMenuTrigger>
          <DropdownMenu.Portal>
            <DropdownMenuContent>
              <DropdownMenuArrow size={20} left="1rem" />
              <DropdownMenuItem
                onSelect={onClickLogout}
                closeOnSelect={false}
                textValue="Logout"
              >
                <Text variant={BodyTextVariant.CaptionText}>Logout</Text>
                <DropdownMenuItemAppend>⌘+K</DropdownMenuItemAppend>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </SideBarBottomSection>
    </SideBarWrapper>
  );
}

const SideBarWrapper = styled.div`
  height: 100%;
  width: 184px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  background-color: ${({ theme }) => theme?.colors.base.a};
`;

const SideBarTopSection = styled.div`
  margin-bottom: 2rem;
  width: 100%;
`;

const LogoRoot = styled(Image.Root)`
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2rem;
`;

const LogoImg = styled(Image.Img)`
  object-fit: contain;
  width: 100%;
  height: 100%;
`;

const LogoFallback = styled(Image.Fallback)`
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;

const SideBarMiddleSection = styled.nav`
  margin-bottom: 2rem;
`;

const SideBarMenu = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const SideMenuAnchorLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  padding: 1rem;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const SideMenuAnchorText = styled(Text)`
  color: inherit;
`;

const SideMenuIcon = styled(Icon)`
  font-size: 1.25rem;
  margin-right: 1rem;
`;

const SideBarBottomSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
`;

const DropdownMenuTrigger = styled(DropdownMenu.Trigger)`
  cursor: pointer;
  border: none;
  background-color: transparent;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const AvatarRoot = styled(Image.Root)`
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
`;

const AvatarImg = styled(Image.Img)`
  object-fit: contain;
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const AvatarFallback = styled(Image.Fallback)`
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
`;
