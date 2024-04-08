// Third Party Imports
import Icon from "solid-fa";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { createReaction, createSignal, Show } from "solid-js";

// Local Imports
import { userCommands } from "@services/commands";
import { User } from "@/models";
import { useAuth } from "@services/auth";
import { useLocale } from "@services/locale";
import { TranslationKey } from "@services/locale/index.types";
import {
  HeadingTextVariant,
  Title,
  Button,
  ButtonVariant,
  PageContainer,
  PageContainerVariant,
} from "@services/styles";

/**
 * The splash view component
 */
export default function Splash() {
  //
  // Hooks
  //

  const auth = useAuth();
  const locale = useLocale();

  //
  // State
  //

  const [users, setUsers] = createSignal<User[]>([]);

  const reactWithAccountIdHydration = createReaction(getUsers);

  //
  // Lifecycle
  //

  reactWithAccountIdHydration(() => auth.store.localAccountId);

  //
  // Functions
  //

  async function getUsers(): Promise<void> {
    const users = await userCommands.getUsers({
      accountId: auth.store.localAccountId,
    });

    if (!users) return;

    setUsers(users || []);
  }

  //
  // Event Handlers
  //

  async function onClickGoogleOAuth(): Promise<void> {
    await auth.createGoogleOAuth();
  }

  async function onClickUserSummary(authId: number): Promise<void> {
    await auth.createGoogleOAuth(authId);
  }

  return (
    <PageContainer variant={PageContainerVariant.Default}>
      <Title variant={HeadingTextVariant.Title}>
        {locale.text(TranslationKey.SplashWelcome)}
      </Title>
      <Show
        when={auth.store.isInitialized}
        fallback={<div>Initializing...</div>}
      >
        <div>
          <Button onClick={onClickGoogleOAuth} variant={ButtonVariant.Primary}>
            <Icon icon={faGoogle} />
          </Button>
          {users().map((userSummary) => (
            <button onClick={() => onClickUserSummary(userSummary.authId)}>
              <img alt="user avatar" src={userSummary.avatar} />
              {userSummary.firstName} {userSummary.lastName}
            </button>
          ))}
        </div>
      </Show>
    </PageContainer>
  );
}
