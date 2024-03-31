// Third Party Imports
import { JSXElement } from "solid-js";

export type NotificationsBindings = {
  store: NotificationStore;
  register: (key: NotificationKey, overrides?: Partial<Notification>) => void;
  deregister: (uid: number) => void;
};

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

export interface NotificationStore {
  notifications: Notification[];
}

export enum NotificationKey {
  Logout,
  LogoutError,
  AvatarUploadError,
  AvatarUploadSuccess,
  AvatarDeleteError,
  AvatarDeleteSuccess,
  CreateRepositoryError,
  CreateRepositorySuccess,
  AuthenticatedUserError,
  AuthSignatureError,
  UpdateUserOnboardingError,
  UpdateUserOnboardingSuccess,
}
