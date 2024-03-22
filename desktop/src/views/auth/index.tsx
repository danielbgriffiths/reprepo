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
  const [activeUser] = useAuth();
  const data = useData();

  //
  // Lifecycle
  //

  if (!activeUser()) {
    navigation("/");
    return;
  }

  createEffect(async () => {
    if (!activeUser()?.email) {
      // TODO: data.user.store.profile
      return navigation("/auth/onboarding");
    }

    if (data.artistProfile.store.activeArtistProfile) {
      return navigation(
        `/auth/${data.artistProfile.store.activeArtistProfile.id}`,
      );
    }

    return navigation("/auth/artist-profiles");
  });

  return <>{props.children}</>;
}
