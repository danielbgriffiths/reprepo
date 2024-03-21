// Third Party Imports
import Icon from "solid-fa";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { createSignal, onMount } from "solid-js";

// Local Imports
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
    <div>
      <h1>Welcome To Reprepo</h1>
      <div>
        {!isAuthStateInitializing() && !activeUser() && (
          <div>
            <button class={"btn btn-primary"} onClick={onClickGoogleOAuth}>
              <Icon icon={faGoogle} />
            </button>
            {userSummaries()
              .filter(
                (userSummary) =>
                  userSummary.provider === AuthenticationProvider.Google,
              )
              .map((userSummary) => (
                <button
                  class={"btn btn-primary"}
                  onClick={() => onClickUserSummary(userSummary.id)}
                >
                  <img alt="user avatar" src={userSummary.avatar} />
                  {userSummary.first_name} {userSummary.last_name}
                </button>
              ))}
          </div>
        )}
        {isAuthStateInitializing() && !authFlowError() && !activeUser() && (
          <div>Initializing...</div>
        )}
        {authFlowError() && <p>{authFlowError()}</p>}
      </div>
    </div>
  );
}
