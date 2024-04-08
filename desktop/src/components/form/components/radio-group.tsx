// Third Party Imports
import { RadioGroup as KobalteRadioGroup } from "@kobalte/core";
import { type JSX, Show, splitProps, For } from "solid-js";

type RadioGroupProps = {
  name: string;
  label?: string | undefined;
  options: { label: string; value: string }[];
  value: string | undefined;
  error: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
};

export function RadioGroup(props: RadioGroupProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "required", "disabled"],
    ["ref", "onInput", "onChange", "onBlur"],
  );
  return (
    <KobalteRadioGroup.Root
      {...rootProps}
      validationState={props.error ? "invalid" : "valid"}
    >
      <Show when={props.label}>
        <KobalteRadioGroup.Label>{props.label}</KobalteRadioGroup.Label>
      </Show>
      <div>
        <For each={props.options}>
          {(option) => (
            <KobalteRadioGroup.Item value={option.value}>
              <KobalteRadioGroup.ItemInput {...inputProps} />
              <KobalteRadioGroup.ItemControl>
                <KobalteRadioGroup.ItemIndicator />
              </KobalteRadioGroup.ItemControl>
              <KobalteRadioGroup.ItemLabel>
                {option.label}
              </KobalteRadioGroup.ItemLabel>
            </KobalteRadioGroup.Item>
          )}
        </For>
      </div>
      <KobalteRadioGroup.ErrorMessage>
        {props.error}
      </KobalteRadioGroup.ErrorMessage>
    </KobalteRadioGroup.Root>
  );
}
