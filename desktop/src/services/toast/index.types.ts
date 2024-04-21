// Third Party Imports
import { JSXElement } from "solid-js";

export type ToastBindings = {
  register: (key: ToastKey, overrides?: Partial<Toast>) => ExistingToast;
  updateError: (existingToast: ExistingToast, error: string) => void;
  updateProgress: (existingToast: ExistingToast, percentage: number) => void;
  close: (id: number) => void;
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

export interface ExistingToast extends Toast {
  id: number;
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
  ResizeAvatar,
  CreateRecordError,
  CreateRecordSuccess,
}
