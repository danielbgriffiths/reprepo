// Third Party Imports
import { Toast as KobalteToast, toaster } from "@kobalte/core";
import { styled } from "solid-styled-components";

// Local Imports
import { ToastContext } from "./create-context";
import {
  ToastBindings,
  ToastProviderProps,
  ToastKey,
  Toast,
  ExistingToast,
} from "../index.types";
import { TOAST_MAP } from "@services/toast/index.config";
import { ToastLayout } from "../components/toast-layout";

export function ToastProvider(props: ToastProviderProps) {
  //
  // Functions
  //

  function register(key: ToastKey, overrides?: Partial<Toast>): ExistingToast {
    const nextToast: Toast = {
      ...TOAST_MAP[key],
      ...(overrides || {}),
    };

    const id = toaster.show((toastProps) => (
      <ToastLayout toastProps={toastProps} toast={nextToast} />
    ));

    return {
      ...nextToast,
      id,
    };
  }

  function updateError(existingToast: ExistingToast, error: string) {
    toaster.update(existingToast.id, (toastProps) => (
      <ToastLayout
        toastProps={toastProps}
        toast={{ ...existingToast, message: error, priority: "high" }}
        isError={true}
      />
    ));
  }

  function updateProgress(existingToast: ExistingToast, percentage: number) {
    toaster.update(existingToast.id, (toastProps) => (
      <ToastLayout
        toastProps={toastProps}
        toast={existingToast}
        percentage={percentage}
      />
    ));
  }

  function close(id: number) {
    toaster.dismiss(id);
  }

  //
  // Lifecycle
  //

  const toastBindings: ToastBindings = {
    register,
    updateError,
    updateProgress,
    close,
  };

  return (
    <ToastContext.Provider value={toastBindings}>
      {props.children}
      <Region
        swipeDirection="right"
        pauseOnInteraction
        pauseOnPageIdle
        limit={5}
        // translations
      >
        <List />
      </Region>
    </ToastContext.Provider>
  );
}

const Region = styled(KobalteToast.Region)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const List = styled(KobalteToast.List)`
  list-style: none;
`;
