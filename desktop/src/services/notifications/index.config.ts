import { Notification, NotificationKey } from "./index.types";

export const NOTIFICATION_MAP: { [K in NotificationKey]: Notification } = {
  [NotificationKey.Logout]: {
    message: "Successfully logged out",
    type: "info",
    duration: 2000,
    isRemovableByClick: true,
  },
  [NotificationKey.LogoutError]: {
    message: "Failed to logout",
    type: "error",
    duration: 5000,
    isRemovableByClick: true,
  },
  [NotificationKey.AvatarUploadError]: {
    type: "error",
    message: "Error uploading avatar.",
    duration: -1,
    isRemovableByClick: true,
  },
  [NotificationKey.AvatarUploadSuccess]: {
    type: "success",
    message: "Avatar Uploaded!",
    duration: 2000,
    isRemovableByClick: true,
  },
  [NotificationKey.AvatarDeleteError]: {
    type: "error",
    message: "Error deleting avatar.",
    duration: -1,
    isRemovableByClick: true,
  },
  [NotificationKey.AvatarDeleteSuccess]: {
    type: "success",
    message: "Avatar Deleted!",
    duration: 2000,
    isRemovableByClick: true,
  },
  [NotificationKey.CreateRepositoryError]: {
    message: "Error creating repository.",
    type: "error",
    duration: -1,
    isRemovableByClick: true,
  },
  [NotificationKey.CreateRepositorySuccess]: {
    message: `Repository created!`,
    type: "success",
    duration: 5000,
    isRemovableByClick: false,
  },
  [NotificationKey.AuthenticatedUserError]: {
    message: "Error getting authenticated user.",
    type: "error",
    duration: 5000,
    isRemovableByClick: true,
  },
  [NotificationKey.AuthSignatureError]: {
    message: "Error creating auth signature.",
    type: "error",
    duration: 5000,
    isRemovableByClick: true,
  },
  [NotificationKey.UpdateUserOnboardingError]: {
    type: "error",
    message: "Error onboarding user",
    duration: -1,
    isRemovableByClick: true,
  },
  [NotificationKey.UpdateUserOnboardingSuccess]: {
    type: "success",
    message: "Success onboarding user",
    duration: 2000,
    isRemovableByClick: true,
  },
};
