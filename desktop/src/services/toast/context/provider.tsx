// Third Party Imports
import Icon from "solid-fa";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { Toast as KobalteToast, toaster } from "@kobalte/core";
import { Show } from "solid-js";

// Local Imports
import { ToastContext } from "./create-context";
import {
  ToastBindings,
  ToastProviderProps,
  ToastKey,
  Toast,
} from "../index.types";
import { BodyTextVariant, Text } from "@services/styles";
import { TOAST_MAP } from "@services/toast/index.config";

export function ToastProvider(props: ToastProviderProps) {
  //
  // Functions
  //

  function register(key: ToastKey, overrides?: Partial<Toast>): void {
    const nextToast: Toast = {
      ...TOAST_MAP[key],
      ...(overrides || {}),
    };

    toaster.show((toastProps) => (
      <KobalteToast.Root
        toastId={toastProps.toastId}
        priority={nextToast.priority}
        duration={nextToast.duration}
        persistent={nextToast.isRemovableByClick && nextToast.duration <= 0}
        // translations
      >
        <div>
          <div>
            <KobalteToast.Title>
              <Text variant={BodyTextVariant.OverlineText}>
                {nextToast.title}
              </Text>
            </KobalteToast.Title>
            <KobalteToast.Description>
              <Text variant={BodyTextVariant.CaptionText}>
                {nextToast.message}
              </Text>
            </KobalteToast.Description>
          </div>
          <Show when={nextToast.isRemovableByClick}>
            <KobalteToast.CloseButton>
              <Icon icon={faTimes} />
            </KobalteToast.CloseButton>
          </Show>
        </div>
        <KobalteToast.ProgressTrack>
          <KobalteToast.ProgressFill />
        </KobalteToast.ProgressTrack>
      </KobalteToast.Root>
    ));
  }

  //
  // Lifecycle
  //

  const toastBindings: ToastBindings = {
    register,
  };

  return (
    <ToastContext.Provider value={toastBindings}>
      {props.children}
      <KobalteToast.Region
        swipeDirection="right"
        pauseOnInteraction
        pauseOnPageIdle
        limit={5}
        // translations
      >
        <KobalteToast.List />
      </KobalteToast.Region>
    </ToastContext.Provider>
  );
}
