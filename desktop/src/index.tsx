/* @refresh reload */

// Third Party Imports
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";
import { ThemeProvider } from "solid-styled-components";

// Local Imports
import Views from "./views";
import Dashboard from "./views/private-layout/dashboard";
import Catch from "./views/private-layout/catch";
import { theme } from "./services/styled";
import { StrongholdProvider } from "./services/stronghold";
import { AuthProvider } from "./services/auth";

const ELEMENT_ID = "root";

/**
 * Lazy import the base routes of certain use-cases
 */
const Splash = lazy(() => import("./views/splash"));
const PrivateLayout = lazy(() => import("./views/private-layout"));

/**
 * Render application
 */
render(
  () => (
    <AuthProvider>
      <StrongholdProvider>
        <ThemeProvider theme={theme}>
          <Router root={Views}>
            <Route path="/" component={Splash} />
            <Route path="/auth" component={PrivateLayout}>
              <Route path="/dashboard" component={Dashboard} />
              <Route path="*404" component={Catch} />
            </Route>
          </Router>
        </ThemeProvider>
      </StrongholdProvider>
    </AuthProvider>
  ),
  document.getElementById(ELEMENT_ID)!,
);
