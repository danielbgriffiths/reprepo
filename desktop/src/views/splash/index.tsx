// Third Party Imports
import Icon from "solid-fa";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { createSignal, onMount } from "solid-js";

// Local Imports
import { PublicLayout } from "@components/partials/public-layout";
import * as GlobalStyled from "@services/styled";
import * as Styled from "./index.styled";
import { Commands } from "@services/commands";
import { AuthenticationProvider } from "@services/auth/index.types";
import { UserSummary } from "@/models";
import { useAuthenticate } from "./hooks/authenticate.hook";
import { useAuth } from "@services/auth";
import { cmd } from "@services/commands/index.utils";

/**
 * The splash view component
 */
export default function Splash() {
  //
  // Hooks
  //

  const [activeUser] = useAuth();
  const [isAuthStateInitializing, authFlowError, createGoogleOAuth] =
    useAuthenticate();

  //
  // State
  //

  const [userSummaries, setUserSummaries] = createSignal<UserSummary[]>([]);

  //
  // Lifecycle
  //

  onMount(async () => {
    const fetchedUserSummariesResult = await cmd<UserSummary[]>(
      Commands.GetUserSummaries,
    );

    setUserSummaries(fetchedUserSummariesResult.data || []);
  });

  //
  // Event Handlers
  //

  async function onClickGoogleOAuth(): Promise<void> {
    await createGoogleOAuth();
  }

  async function onClickUserSummary(userSummaryId: number): Promise<void> {
    await createGoogleOAuth(userSummaryId);
  }

  return (
    <PublicLayout>
      <GlobalStyled.PublicPageTitle>
        Welcome To Reprepo
      </GlobalStyled.PublicPageTitle>
      <Styled.Content>
        {!isAuthStateInitializing() && !activeUser() && (
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
        {isAuthStateInitializing() && !authFlowError() && !activeUser() && (
          <div>Initializing...</div>
        )}
        {authFlowError() && <p>{authFlowError()}</p>}
      </Styled.Content>
    </PublicLayout>
  );
}
