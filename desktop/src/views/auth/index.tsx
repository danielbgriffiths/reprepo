// Third Party Imports
import { createEffect } from "solid-js";
import { RouteSectionProps, useNavigate } from "@solidjs/router";

// Local Imports
import { useData } from "@services/data";
import { useAuth } from "@services/auth";

export interface AuthProps extends RouteSectionProps {}

export default function Auth(props: AuthProps) {
  //
  // Hooks
  //

  const navigation = useNavigate();
  const auth = useAuth();
  const data = useData();

  //
  // Lifecycle
  //

  if (!auth.store.auth) {
    navigation("/");
    return;
  }

  createEffect(async () => {
    if (!auth.store.user?.isOnboarded) {
      return navigation("/auth/onboarding");
    }

    if (data.repository.store.activeRepository) {
      return navigation(
        `/auth/repositories/${data.repository.store.activeRepository.id}`,
      );
    }

    return navigation("/auth/repositories");
  });

  return <>{props.children}</>;
}
