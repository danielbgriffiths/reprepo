// Local Imports
import { useNotifications } from "@services/notifications";

export interface ToastBarProps {}

export function ToastBar(_props: ToastBarProps) {
  //
  // Hooks
  //

  const [notifications] = useNotifications();

  return (
    <>
      {notifications().map((notification) => (
        <div class="toast">
          <div class="alert alert-info">{notification.message}</div>
        </div>
      ))}
    </>
  );
}
