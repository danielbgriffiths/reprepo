// Third Party Imports
import Icon from "solid-fa";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { invoke } from "@tauri-apps/api";
import { createSignal, onMount } from "solid-js";

// Local Imports
import { PublicLayout } from "@components/partials/public-layout";
import * as GlobalStyled from "@services/styled";
import * as Styled from "./index.styled";
import { Commands } from "@services/commands";
import { AuthenticationProvider } from "@services/auth/index.types.ts";
import { UserSummary } from "@/models";
import { useAuthenticate } from "./hooks/authenticate.hook.ts";
import { useAuth } from "@services/auth";

/**
 * The splash view component
 */
export default function Splash() {
  //
  // Hooks
  //

  const auth = useAuth();
  const [
    isAuthStateInitializing,
    authFlowError,
    createGoogleOAuth,
    accessGoogleOAuth,
  ] = useAuthenticate();

  //
  // State
  //

  const [userSummaries, setUserSummaries] = createSignal<UserSummary[]>([]);

  //
  // Lifecycle
  //

  onMount(async () => {
    try {
      const fetchedUserSummaries = await invoke<UserSummary[]>(
        Commands.GetUserSummaries,
      );
      setUserSummaries(fetchedUserSummaries);
    } catch (e) {
      console.error("onMount: ", e);
    }
  });

  //
  // Event Handlers
  //

  async function onClickGoogleOAuth(): Promise<void> {
    try {
      await createGoogleOAuth();
    } catch (e) {
      console.error("onClickGoogleOAuth: ", e);
    }
  }

  async function onClickUserSummary(userSummaryId: number): Promise<void> {
    try {
      await accessGoogleOAuth(userSummaryId);
    } catch (e) {
      console.error("onClickUserSummary: ", e);
    }
  }

  return (
    <PublicLayout>
      <GlobalStyled.PublicPageTitle>
        Welcome To Reprepo
      </GlobalStyled.PublicPageTitle>
      <Styled.Content>
        {!isAuthStateInitializing() && !auth.activeUser() && (
          <div>
            <GlobalStyled.LinkButton onClick={onClickGoogleOAuth}>
              <Icon icon={faGoogle} />
            </GlobalStyled.LinkButton>
            {userSummaries()
              .filter(
                (userSummary) =>
                  userSummary.provider === AuthenticationProvider.Google,
              )
              .map((userSummary) => (
                <GlobalStyled.LinkButton
                  onClick={() => onClickUserSummary(userSummary.id)}
                >
                  <img alt="user avatar" src={userSummary.avatar} />
                  {userSummary.first_name} {userSummary.last_name}
                </GlobalStyled.LinkButton>
              ))}
          </div>
        )}
        {isAuthStateInitializing() && !auth.activeUser() && (
          <div>Initializing...</div>
        )}
        {authFlowError() && <p>{authFlowError()}</p>}
      </Styled.Content>
    </PublicLayout>
  );
}
