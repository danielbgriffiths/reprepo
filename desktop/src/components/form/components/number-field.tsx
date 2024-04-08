// Third Party Imports
import { NumberField as KobalteNumberField } from "@kobalte/core";
import { type JSX, Show, splitProps } from "solid-js";

type NumberFieldProps = {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  value: number | undefined;
  error: string;
  multiline?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLInputElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
};

export function NumberField(props: NumberFieldProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );

  return (
    <KobalteNumberField.Root
      {...rootProps}
      validationState={props.error ? "invalid" : "valid"}
    >
      <Show when={props.label}>
        <KobalteNumberField.Label>{props.label}</KobalteNumberField.Label>
      </Show>
      <KobalteNumberField.Input {...inputProps} type="number" />
      <KobalteNumberField.ErrorMessage>
        {props.error}
      </KobalteNumberField.ErrorMessage>
    </KobalteNumberField.Root>
  );
}
