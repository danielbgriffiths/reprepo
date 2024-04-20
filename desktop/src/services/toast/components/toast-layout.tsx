// Third Party Imports
import Icon from "solid-fa";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { Toast as KobalteToast } from "@kobalte/core";
import { Show } from "solid-js";
import { styled } from "solid-styled-components";

// Local Imports
import { Toast } from "../index.types";
import { BodyTextVariant, Text } from "@services/styles";

interface ToastLayoutProps {
  toast: Toast;
  toastProps: KobalteToast.ToastComponentProps;
  isError?: boolean;
  percentage?: number;
}

export function ToastLayout(props: ToastLayoutProps) {
  return (
    <ToastRoot
      toastId={props.toastProps.toastId}
      priority={props.toast.priority}
      duration={props.toast.duration}
      persistent={props.toast.isRemovableByClick || props.toast.duration < 1}
      // translations
    >
      <ToastItem isError={props.isError}>
        <ToastTitle>
          <Text variant={BodyTextVariant.Text}>{props.toast.title}</Text>
        </ToastTitle>
        <ToastDescription>
          <Text variant={BodyTextVariant.CaptionText}>
            {props.toast.message}
          </Text>
        </ToastDescription>
        <Show when={props.toast.isRemovableByClick}>
          <ToastCloseButton>
            <Icon icon={faTimes} />
          </ToastCloseButton>
        </Show>
        <Show when={!!props.toast.duration || !!props.percentage}>
          <ToastProgressTrack
            progressType={!!props.percentage ? "percentage" : "duration"}
          >
            <ToastProgressFill percentage={props.percentage} />
          </ToastProgressTrack>
        </Show>
      </ToastItem>
    </ToastRoot>
  );
}

const ToastRoot = styled(KobalteToast.Root)`
  margin-bottom: 1rem;
  margin-right: 1rem;
`;

const ToastItem = styled.div<{ isError?: boolean }>`
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

const ToastProgressTrack = styled(KobalteToast.ProgressTrack)<{
  progressType: "percentage" | "duration";
}>`
  width: 100%;
  height: 4px;
  margin-top: 0.4rem;
`;

const ToastProgressFill = styled(KobalteToast.ProgressFill)<{
  percentage?: number;
}>``;
