// Third Party Imports
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

// Local Imports
import Views from "@views/index";
import { StyleProvider } from "@services/styles";
import { DataProvider } from "@services/data";

/**
 * Lazy import the base routes of certain use-cases
 */
const Splash = lazy(() => import("@views/splash"));
const Dashboard = lazy(() => import("@views/dashboard"));
const Records = lazy(() => import("@views/records"));
const Record = lazy(() => import("@views/record"));
const CreateRecord = lazy(() => import("@views/create-record"));
const CreateConnect = lazy(() => import("@views/create-connect"));
const Onboarding = lazy(() => import("@views/onboarding"));
const CreateArtistProfile = lazy(() => import("@views/create-artist-profile"));
const Catch = lazy(() => import("@views/catch"));
const Auth = lazy(() => import("@views/auth"));
const ArtistProfiles = lazy(() => import("@views/artist-profiles"));

export function ViewEntry() {
  return (
    <DataProvider>
      <StyleProvider>
        <Router root={Views}>
          <Route path="/" component={Splash} />
          <Route path="/auth" component={Auth}>
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/artist-profiles" component={ArtistProfiles} />
            <Route
              path="/artist-profiles/create"
              component={CreateArtistProfile}
            />
            <Route path="/artist-profiles/:id" component={Dashboard}>
              <Route path="/records" component={Records}>
                <Route path="/create" component={CreateRecord} />
                <Route path="/:id" component={Record} />
              </Route>
            </Route>
            <Route path="/create-connect" component={CreateConnect} />
          </Route>
          <Route path="*404" component={Catch} />
        </Router>
      </StyleProvider>
    </DataProvider>
  );
}
