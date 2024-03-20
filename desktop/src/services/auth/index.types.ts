import { Accessor, JSXElement } from "solid-js";

import { UserSummary } from "@/models";

export type AuthBindings = [
  Accessor<UserSummary | undefined>,
  (user?: UserSummary) => void,
];

export interface AuthProviderProps {
  children: JSXElement;
}

export enum AuthenticationProvider {
  Google = "Google",
  Instagram = "Instagram",
  Pinterest = "Pinterest",
  Email = "Email",
}
