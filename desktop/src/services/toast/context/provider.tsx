// Third Party Imports
import Icon from "solid-fa";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { Toast as KobalteToast, toaster } from "@kobalte/core";
import { Show } from "solid-js";
import { styled } from "solid-styled-components";

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

    console.log("nextToast: ", nextToast);

    toaster.show((toastProps) => (
      <ToastRoot
        toastId={toastProps.toastId}
        priority={nextToast.priority}
        duration={nextToast.duration}
        persistent={nextToast.isRemovableByClick || nextToast.duration < 1}
        // translations
      >
        <ToastItem>
          <ToastTitle>
            <Text variant={BodyTextVariant.Text}>{nextToast.title}</Text>
          </ToastTitle>
          <ToastDescription>
            <Text variant={BodyTextVariant.CaptionText}>
              {nextToast.message}
            </Text>
          </ToastDescription>
          <Show when={nextToast.isRemovableByClick}>
            <ToastCloseButton>
              <Icon icon={faTimes} />
            </ToastCloseButton>
          </Show>
          <ToastProgressTrack>
            <KobalteToast.ProgressFill />
          </ToastProgressTrack>
        </ToastItem>
      </ToastRoot>
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

const ToastRoot = styled(KobalteToast.Root)`
  margin-bottom: 1rem;
  margin-right: 1rem;
`;

const ToastItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 4px 4px 14px -5px rgba(0, 0, 0, 0.8);
  position: relative;
  min-width: 280px;
  border: solid 1px #fff;
`;

const ToastTitle = styled(KobalteToast.Title)`
  margin-bottom: 0.4rem;
`;

const ToastDescription = styled(KobalteToast.Description)`
  margin-bottom: 0.4rem;
`;

const ToastCloseButton = styled(KobalteToast.CloseButton)`
  cursor: pointer;
  background-color: transparent;
  border: none;
  position: absolute;
  top: 0;
  right: 0;

  &:hover {
  }
`;

const ToastProgressTrack = styled(KobalteToast.ProgressTrack)`
  width: 100%;
  height: 4px;
  margin-top: 0.4rem;
`;
