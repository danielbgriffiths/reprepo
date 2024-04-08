// Third Party Imports
import { Checkbox as KobalteCheckbox } from "@kobalte/core";
import { type JSX, splitProps } from "solid-js";
import Icon from "solid-fa";
import { faCheck } from "@fortawesome/pro-light-svg-icons";

type CheckboxProps = {
  name: string;
  label: string;
  value?: string | undefined;
  checked: boolean | undefined;
  error: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLInputElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
};

export function Checkbox(props: CheckboxProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "checked", "required", "disabled"],
    ["ref", "onInput", "onChange", "onBlur"],
  );

  return (
    <KobalteCheckbox.Root
      {...rootProps}
      validationState={props.error ? "invalid" : "valid"}
    >
      <KobalteCheckbox.Input {...inputProps} />
      <KobalteCheckbox.Control>
        <KobalteCheckbox.Indicator>
          <Icon icon={faCheck} />
        </KobalteCheckbox.Indicator>
      </KobalteCheckbox.Control>
      <KobalteCheckbox.Label>{props.label}</KobalteCheckbox.Label>
    </KobalteCheckbox.Root>
  );
}
