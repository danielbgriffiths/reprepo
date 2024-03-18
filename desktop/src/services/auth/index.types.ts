import { Accessor, JSXElement } from "solid-js";

import { UserSummary } from "@/models";

export interface AuthBindings {
  activeUser: Accessor<UserSummary | undefined>;
  setActiveUser: (user?: UserSummary) => void;
}

export interface AuthProviderProps {
  children: JSXElement;
}

export enum AuthenticationProvider {
  Google = "Google",
  Instagram = "Instagram",
  Pinterest = "Pinterest",
  Email = "Email",
}
