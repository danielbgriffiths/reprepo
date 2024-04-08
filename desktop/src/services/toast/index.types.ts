// Third Party Imports
import { JSXElement } from "solid-js";

export type ToastBindings = {
  register: (key: ToastKey, overrides?: Partial<Toast>) => void;
};

export interface ToastProviderProps {
  children: JSXElement;
}

export interface Toast {
  title: string;
  message: JSXElement;
  type: "info" | "error" | "success" | "warning" | "alert" | "default";
  priority: "high" | "low";
  duration: number;
  isRemovableByClick: boolean;
}

export enum ToastKey {
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
