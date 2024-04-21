// Third Party Imports
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

// Local Imports
import Views from "@views/index";
import { StyleProvider } from "@services/styles";

const Splash = lazy(() => import("@views/splash"));
const Dashboard = lazy(() => import("@views/dashboard"));
const Records = lazy(() => import("@views/records"));
const Record = lazy(() => import("@views/record"));
const CreateRecord = lazy(() => import("@views/create-record"));
const CreateConnect = lazy(() => import("@views/create-connect"));
const Onboarding = lazy(() => import("@views/onboarding"));
const CreateRepository = lazy(() => import("@views/create-repository"));
const Catch = lazy(() => import("@views/catch"));
const Repositories = lazy(() => import("@views/repositories"));

export function ViewEntry() {
  return (
    <StyleProvider>
      <Router root={Views}>
        <Route path="/" component={Splash} />
        <Route path="/auth/onboarding" component={Onboarding} />
        <Route path="/auth/repositories" component={Repositories} />
        <Route path="/auth/repositories/create" component={CreateRepository} />
        <Route path="/auth/repositories/:id" component={Dashboard} />
        <Route path="/auth/repositories/:id/records" component={Records} />
        <Route
          path="/auth/repositories/:id/records/create"
          component={CreateRecord}
        />
        <Route
          path="/auth/repositories/:id/records/:recordId"
          component={Record}
        />
        <Route path="/auth/create-connect" component={CreateConnect} />
        <Route path="*404" component={Catch} />
      </Router>
    </StyleProvider>
  );
}
