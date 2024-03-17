// Third Party Imports
import Icon from "solid-fa";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { invoke } from "@tauri-apps/api";
import { useNavigate } from "@solidjs/router";
import { createEffect, createReaction, createSignal } from "solid-js";

// Local Imports
import { PublicLayout } from "../../components/partials/public-layout";
import * as GlobalStyled from "../../services/styled";
import * as Styled from "./index.styled";
import { Commands } from "../../services/commands";
import { useStronghold } from "../../services/stronghold";
import { StrongholdKeys } from "../../services/stronghold/index.config.ts";
import { useAuth } from "../../services/auth";
import {
  AuthenticationProvider,
  GoogleOAuthResponse,
} from "../../services/auth/index.types.ts";
import { UserSummary } from "../../models";

/**
 * The splash view component
 */
export default function Splash() {
  //
  // Hooks
  //

  const stronghold = useStronghold();
  const auth = useAuth();
  const navigate = useNavigate();

  //
  // State
  //

  const [userSummaries, setUserSummaries] = createSignal<UserSummary[]>([]);

  const reactWithStrongholdRead = createReaction(async () => {
    const id = await stronghold.read(StrongholdKeys.AuthId);
    const email = await stronghold.read(StrongholdKeys.AuthEmail);
    const first_name = await stronghold.read(StrongholdKeys.AuthFirstName);
    const last_name = await stronghold.read(StrongholdKeys.AuthLastName);
    const avatar = await stronghold.read(StrongholdKeys.AuthAvatar);
    const provider = await stronghold.read(StrongholdKeys.AuthProvider);

    if (!id || !email || !first_name || !last_name || !provider) {
      setUserSummaries(await invoke(Commands.GetUserSummaries));
      return;
    }

    auth.setActiveUser({
      id: parseInt(id),
      email,
      first_name,
      last_name,
      avatar,
      provider: provider as AuthenticationProvider,
    });
  });

  //
  // Lifecycle
  //

  reactWithStrongholdRead(() => stronghold.isInitialized());

  createEffect(() => {
    if (!auth.activeUser()) return;
    navigate("/auth/dashboard", { replace: true });
  });

  //
  // Event Handlers
  //

  async function onClickGoogleOAuth(): Promise<void> {
    const oAuthResponse = await invoke<GoogleOAuthResponse>(
      Commands.CreateGoogleOAuth,
    );

    await storeUserSummary(oAuthResponse.user_summary);

    auth.setActiveUser(oAuthResponse.user_summary);
  }

  async function onClickUserSummary(userSummaryId: number): Promise<void> {
    const oAuthResponse = await invoke<GoogleOAuthResponse>(
      Commands.AccessGoogleOAuth,
      { id: userSummaryId },
    );

    await storeUserSummary(oAuthResponse.user_summary);

    auth.setActiveUser(oAuthResponse.user_summary);
  }

  //
  // Functions
  //

  async function storeUserSummary({
    id,
    email,
    first_name,
    last_name,
    avatar,
    provider,
  }: UserSummary): Promise<void> {
    await stronghold.insert(StrongholdKeys.AuthId, id.toString());
    await stronghold.insert(StrongholdKeys.AuthEmail, email);
    await stronghold.insert(StrongholdKeys.AuthFirstName, first_name);
    await stronghold.insert(StrongholdKeys.AuthLastName, last_name);
    await stronghold.insert(StrongholdKeys.AuthAvatar, avatar!);
    await stronghold.insert(StrongholdKeys.AuthProvider, provider);
  }

  return (
    <PublicLayout>
      <GlobalStyled.PublicPageTitle>
        Welcome To Reprepo
      </GlobalStyled.PublicPageTitle>
      <Styled.Content>
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
      </Styled.Content>
    </PublicLayout>
  );
}
