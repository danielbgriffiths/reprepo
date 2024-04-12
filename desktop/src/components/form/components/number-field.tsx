// Third Party Imports
import { NumberField as KobalteNumberField } from "@kobalte/core";
import { type JSX, Show, splitProps } from "solid-js";
import { styled } from "solid-styled-components";

// Local Imports
import { BodyTextVariant, Text } from "@services/styles";

type NumberFieldProps = {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  defaultValue?: number;
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
    ["name", "defaultValue", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );

  return (
    <Root {...rootProps} validationState={props.error ? "invalid" : "valid"}>
      <Show when={props.label}>
        <Label>
          <Text variant={BodyTextVariant.CaptionText}>{props.label}</Text>
        </Label>
      </Show>
      <Input {...inputProps} type="number" />
      <ErrorMessage>
        <Text variant={BodyTextVariant.CaptionText}>{props.error}</Text>
      </ErrorMessage>
    </Root>
  );
}

const Root = styled(KobalteNumberField.Root)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const Label = styled(KobalteNumberField.Label)`
  margin-bottom: 0.4rem;
`;

const Input = styled(KobalteNumberField.Input)`
  width: 100%;
  min-height: 40px;
  padding: 0 1rem;
`;

const ErrorMessage = styled(KobalteNumberField.ErrorMessage)``;
