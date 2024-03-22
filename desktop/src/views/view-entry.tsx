// Third Party Imports
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

// Local Imports
import Views from "@views/index";
import { StyleProvider } from "@services/styles";

/**
 * Lazy import the base routes of certain use-cases
 */
const Splash = lazy(() => import("@views/splash"));
const Dashboard = lazy(() => import("@views/dashboard"));
const Catch = lazy(() => import("@views/catch"));

export function ViewEntry() {
  return (
    <StyleProvider>
      <Router root={Views}>
        <Route path="/" component={Splash} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="*404" component={Catch} />
      </Router>
    </StyleProvider>
  );
}
