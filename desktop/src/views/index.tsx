// Third Party Imports
import { children, createEffect, createReaction } from "solid-js";
import { RouteSectionProps, useNavigate } from "@solidjs/router";
import { styled } from "solid-styled-components";

// Local Imports
import { SideBar } from "@components/side-bar";
import { TopBar } from "@components/top-bar";
import { ToastBar } from "@components/toast-bar";
import { useData } from "@services/data";
import { useStronghold } from "@services/stronghold";
import { useAuth } from "@services/auth";

export interface ViewsProps extends RouteSectionProps {}

export default function Views(props: ViewsProps) {
  //
  // Hooks
  //

  const data = useData();
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
    data.general
      .hydrateAccountId()
      .then(auth.createAuthFromStronghold)
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

    if (data.repository.store.activeRepository) {
      return navigate(
        `/auth/repositories/${data.repository.store.activeRepository.id}`,
        { replace: true },
      );
    }

    return navigate("/auth/repositories", { replace: true });
  });

  //a
  // Functions
  //

  async function hydrateFromStronghold(): Promise<void> {
    await data.general.hydrateAccountId();
    await auth.createAuthFromStronghold();
  }

  return (
    <>
      <SideBar />
      <Styled.Container>
        <TopBar />
        <Styled.Content>{c()}</Styled.Content>
      </Styled.Container>
      <ToastBar />
    </>
  );
}

const Styled = {
  Container: styled.div``,
  Content: styled.div``,
};
