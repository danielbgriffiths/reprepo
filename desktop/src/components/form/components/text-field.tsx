// Third Party Imports
import { TextField as KobalteTextField } from "@kobalte/core";
import { type JSX, Show, splitProps } from "solid-js";

type TextFieldProps = {
  name: string;
  type?: "text" | "email" | "tel" | "password" | "url" | "date" | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  defaultValue?: string;
  error: string;
  multiline?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
};

export function TextField(props: TextFieldProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "defaultValue", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );

  return (
    <KobalteTextField.Root
      {...rootProps}
      validationState={props.error ? "invalid" : "valid"}
    >
      <Show when={props.label}>
        <KobalteTextField.Label>{props.label}</KobalteTextField.Label>
      </Show>
      <KobalteTextField.Input {...inputProps} type={props.type} />
      <KobalteTextField.ErrorMessage>
        {props.error}
      </KobalteTextField.ErrorMessage>
    </KobalteTextField.Root>
  );
}
