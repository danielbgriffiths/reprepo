/* @refresh reload */

// Third Party Imports
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

// Local Imports
import Views from "./views";
import Login from "./views/login";
import Register from "./views/register";
import Dashboard from "./views/private-layout/dashboard";
import Catch from "./views/private-layout/catch";

import "./styles.scss";

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
    <Router root={Views}>
      <Route path="/" component={Splash} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/auth" component={PrivateLayout}>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="*404" component={Catch} />
      </Route>
    </Router>
  ),
  document.getElementById(ELEMENT_ID)!,
);
