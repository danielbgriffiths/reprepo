import { Accessor, JSXElement } from "solid-js";

export type NotificationsBindings = [
  Accessor<Notification[]>,
  {
    addNotification: (notification: Notification) => void;
    removeNotification: (notification: Notification) => void;
  },
];

export interface NotificationsProviderProps {
  children: JSXElement;
}

export interface Notification {
  uid?: number;
  message: JSXElement;
  type: "info" | "error" | "success" | "warning" | "alert" | "default";
  duration: number;
  isRemovableByClick: boolean;
}
