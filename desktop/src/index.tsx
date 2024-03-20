/* @refresh reload */

// Third Party Imports
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { ThemeProvider } from "solid-styled-components";

// Local Imports
import Views from "@views/index";
import { theme } from "@services/styled";
import { StrongholdProvider } from "@services/stronghold";
import { AuthProvider } from "@services/auth";
import { NotificationsProvider } from "@services/notifications";

const ELEMENT_ID = "root";

/**
 * Lazy import the base routes of certain use-cases
 */
const Splash = lazy(() => import("@views/splash"));
const Dashboard = lazy(() => import("@views/dashboard"));
const Catch = lazy(() => import("@views/catch"));

/**
 * Render application
 */
render(
  () => (
    <NotificationsProvider>
      <AuthProvider>
        <StrongholdProvider>
          <ThemeProvider theme={theme}>
            <Router root={Views}>
              <Route path="/" component={Splash} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="*404" component={Catch} />
            </Router>
          </ThemeProvider>
        </StrongholdProvider>
      </AuthProvider>
    </NotificationsProvider>
  ),
  document.getElementById(ELEMENT_ID)!,
);
