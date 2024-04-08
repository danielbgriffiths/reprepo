// Third Party Imports
import { Checkbox as KobalteSwitch } from "@kobalte/core";
import { type JSX, splitProps } from "solid-js";
import { faCheck } from "@fortawesome/pro-light-svg-icons";
import Icon from "solid-fa";

type SwitchProps = {
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

export function Switch(props: SwitchProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "checked", "required", "disabled"],
    ["ref", "onInput", "onChange", "onBlur"],
  );
  return (
    <KobalteSwitch.Root
      {...rootProps}
      validationState={props.error ? "invalid" : "valid"}
    >
      <KobalteSwitch.Input {...inputProps} />
      <KobalteSwitch.Control>
        <KobalteSwitch.Indicator>
          <Icon icon={faCheck} />
        </KobalteSwitch.Indicator>
      </KobalteSwitch.Control>
      <KobalteSwitch.Label>{props.label}</KobalteSwitch.Label>
    </KobalteSwitch.Root>
  );
}
