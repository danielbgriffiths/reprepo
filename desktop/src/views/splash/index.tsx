// Third Party Imports
import Icon from "solid-fa";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { invoke } from "@tauri-apps/api";

// Local Imports
import { PublicLayout } from "../../components/partials/public-layout";
import * as GlobalStyled from "../../services/styled";
import * as Styled from "./index.styled";
import { Commands } from "../../services/commands";

/**
 * The splash view component
 */
export default function Splash() {
  //
  // Event Handlers
  //

  async function onClickGoogleOAuth(): Promise<void> {
    await invoke(Commands.CreateGoogleOAuthClient);
    // TODO: Use Stronghold service to save token information and login user
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
        </div>
      </Styled.Content>
    </PublicLayout>
  );
}
