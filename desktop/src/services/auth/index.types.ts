import { JSX, JSXElement } from "solid-js";
import Accessor = JSX.Accessor;

import { UserSummary } from "../../models";

export interface AuthBindings {
  activeUser: Accessor<UserSummary | undefined>;
  setActiveUser: (user?: UserSummary) => void;
}

export interface AuthProviderProps {
  children: JSXElement;
}

export interface GoogleOAuthResponse {
  user_summary: UserSummary;
  error_message?: string;
}

export enum AuthenticationProvider {
  Google = "google",
  Email = "email",
}
