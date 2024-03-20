import { Accessor, JSXElement } from "solid-js";

export type NotificationsBindings = [
  Accessor<string | undefined>,
  (string?: string) => void,
];

export interface NotificationsProviderProps {
  children: JSXElement;
}
