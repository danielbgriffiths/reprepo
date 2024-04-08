/* @refresh reload */

// Third Party Imports
import { render } from "solid-js/web";

// Local Imports
import { StrongholdProvider } from "@services/stronghold";
import { AuthProvider } from "@services/auth";
import { ViewEntry } from "@views/view-entry";
import { LocaleProvider } from "@services/locale";

const ELEMENT_ID = "root";

/**
 * Render application
 */
render(
  () => (
    <LocaleProvider>
      <StrongholdProvider>
        <AuthProvider>
          <ViewEntry />
        </AuthProvider>
      </StrongholdProvider>
    </LocaleProvider>
  ),
  document.getElementById(ELEMENT_ID)!,
);
