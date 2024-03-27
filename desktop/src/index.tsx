/* @refresh reload */

// Third Party Imports
import { render } from "solid-js/web";

// Local Imports
import { StrongholdProvider } from "@services/stronghold";
import { AuthProvider } from "@services/auth";
import { NotificationsProvider } from "@services/notifications";
import { ViewEntry } from "@views/view-entry";

import "@services/styles/_main.scss";
import { LocaleProvider } from "@services/locale";

const ELEMENT_ID = "root";

/**
 * Render application
 */
render(
  () => (
    <NotificationsProvider>
      <LocaleProvider>
        <StrongholdProvider>
          <AuthProvider>
            <ViewEntry />
          </AuthProvider>
        </StrongholdProvider>
      </LocaleProvider>
    </NotificationsProvider>
  ),
  document.getElementById(ELEMENT_ID)!,
);
