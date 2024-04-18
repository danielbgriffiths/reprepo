// Third Party Imports
import { Switch as KobalteSwitch } from "@kobalte/core";
import { type JSX, splitProps } from "solid-js";
import { styled } from "solid-styled-components";
import { BodyTextVariant, Text } from "@services/styles";

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
    <Root {...rootProps} validationState={props.error ? "invalid" : "valid"}>
      <KobalteSwitch.Input {...inputProps} />
      <Label>
        <Text variant={BodyTextVariant.CaptionText}>{props.label}</Text>
      </Label>
      <Control>
        <Thumb />
      </Control>
      <KobalteSwitch.ErrorMessage>{props.error}</KobalteSwitch.ErrorMessage>
    </Root>
  );
}

const Root = styled(KobalteSwitch.Root)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 1rem;
`;

const Label = styled(KobalteSwitch.Label)`
  margin-right: 1rem;
`;

const Thumb = styled(KobalteSwitch.Thumb)`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  background-color: #d4d4d8;
  transition: 0.25s transform;
`;

const Control = styled(KobalteSwitch.Control)`
  display: inline-flex;
  align-items: center;
  height: 24px;
  width: 44px;
  border: 1px solid hsl(240 5% 84%);
  border-radius: 12px;
  padding: 0 2px;
  background-color: #e4e4e7;
  transition: 0.25s background-color;
`;
