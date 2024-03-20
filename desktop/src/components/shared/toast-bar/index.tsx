import { useNotifications } from "@services/notifications";

export interface ToastBarProps {}

export function ToastBar(_props: ToastBarProps) {
  const [notification] = useNotifications();

  if (!notification) return;

  return <div>{notification()}</div>;
}
