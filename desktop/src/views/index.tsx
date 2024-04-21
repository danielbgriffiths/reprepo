// Third Party Imports
import { children, createEffect, createReaction } from "solid-js";
import { RouteSectionProps, useNavigate } from "@solidjs/router";
import { styled } from "solid-styled-components";

// Local Imports
import { SideBar } from "@components/side-bar";
import { TopBar } from "@components/top-bar";
import { useStronghold } from "@services/stronghold";
import { useAuth } from "@services/auth";
import { ToastProvider } from "@services/toast";

export interface ViewsProps extends RouteSectionProps {}

export default function Views(props: ViewsProps) {
  //
  // Hooks
  //

  const stronghold = useStronghold();
  const auth = useAuth();
  const navigate = useNavigate();

  //
  // State
  //

  const c = children(() => props.children);
  const strongholdInitReaction = createReaction(hydrateFromStronghold);

  //
  // Lifecycle
  //

  if (stronghold.isInitialized()) {
    auth
      .hydrateLocalAccountId()
      .then(auth.createAuthFromStronghold)
      .then(auth.hydrateActiveRepositoryId)
      .catch(console.error);
  } else {
    strongholdInitReaction(() => stronghold.isInitialized());
  }

  createEffect(async () => {
    if (!auth.store.auth) {
      return navigate("/", { replace: true });
    }

    if (!auth.store.user?.isOnboarded) {
      return navigate("/auth/onboarding", { replace: true });
    }

    if (auth.store.activeRepositoryId) {
      return navigate(
        `/auth/repositories/${String(auth.store.activeRepositoryId)}`,
        {
          replace: true,
        },
      );
    }

    return navigate("/auth/repositories", { replace: true });
  });

  //a
  // Functions
  //

  async function hydrateFromStronghold(): Promise<void> {
    await auth.hydrateLocalAccountId();
    await auth.createAuthFromStronghold();
    await auth.hydrateActiveRepositoryId();
  }

  return (
    <ToastProvider>
      <SideBar />
      <Wrapper>
        <TopBar />
        <Content>{c()}</Content>
      </Wrapper>
    </ToastProvider>
  );
}

const Wrapper = styled("div")`
  width: 100%;
  height: 100%;
`;
const Content = styled("div")`
  width: 100%;
  height: calc(100% - 50px);
  overflow: hidden;
`;
