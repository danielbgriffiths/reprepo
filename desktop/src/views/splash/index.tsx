// Third Party Imports
import Icon from "solid-fa";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { createReaction, createSignal, Show } from "solid-js";

// Local Imports
import { Commands } from "@services/commands";
import { User } from "@/models";
import { useAuth } from "@services/auth";
import { cmd } from "@services/commands/index.utils";
import { useLocale } from "@services/locale";
import { TranslationKey } from "@services/locale/index.types";
import { useData } from "@services/data";

/**
 * The splash view component
 */
export default function Splash() {
  //
  // Hooks
  //

  const auth = useAuth();
  const [_, localeActions] = useLocale();
  const data = useData();

  //
  // State
  //

  const [users, setUsers] = createSignal<User[]>([]);

  const reactWithAccountIdHydration = createReaction(getUsers);

  //
  // Lifecycle
  //

  reactWithAccountIdHydration(() => data.general.store.accountId);

  //
  // Functions
  //

  async function getUsers(): Promise<void> {
    const usersResult = await cmd<User[]>(Commands.GetUsers, {
      accountId: data.general.store.accountId,
    });

    setUsers(usersResult.data || []);
  }

  //
  // Event Handlers
  //

  async function onClickGoogleOAuth(): Promise<void> {
    await auth.createGoogleOAuth(data);
  }

  async function onClickUserSummary(authId: number): Promise<void> {
    await auth.createGoogleOAuth(data, authId);
  }

  return (
    <div>
      <h1>{localeActions.text(TranslationKey.SplashWelcome)}</h1>
      <Show
        when={auth.store.isInitialized}
        fallback={<div>Initializing...</div>}
      >
        <div>
          <button onClick={onClickGoogleOAuth}>
            <Icon icon={faGoogle} />
          </button>
          {users().map((userSummary) => (
            <button onClick={() => onClickUserSummary(userSummary.authId)}>
              <img alt="user avatar" src={userSummary.avatar} />
              {userSummary.firstName} {userSummary.lastName}
            </button>
          ))}
        </div>
      </Show>
    </div>
  );
}
