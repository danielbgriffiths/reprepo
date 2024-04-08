// Third Party Imports
import { Select as KobalteSelect } from "@kobalte/core";
import {
  type JSX,
  Show,
  splitProps,
  createEffect,
  createSignal,
} from "solid-js";
import Icon from "solid-fa";
import { faCheck } from "@fortawesome/pro-light-svg-icons";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  options: Option[];
  value: string | undefined;
  error: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLSelectElement) => void;
  onInput: JSX.EventHandler<HTMLSelectElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onBlur: JSX.EventHandler<HTMLSelectElement, FocusEvent>;
};

export function Select(props: SelectProps) {
  const [rootProps, selectProps] = splitProps(
    props,
    ["name", "placeholder", "options", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );

  const [getValue, setValue] = createSignal<Option>();

  createEffect(() => {
    setValue(props.options.find((option) => props.value === option.value));
  });

  return (
    <KobalteSelect.Root
      {...rootProps}
      multiple={false}
      value={getValue()}
      onChange={setValue}
      optionValue="value"
      optionTextValue="label"
      validationState={props.error ? "invalid" : "valid"}
      itemComponent={(props) => (
        <KobalteSelect.Item item={props.item}>
          <KobalteSelect.ItemLabel>
            {props.item.textValue}
          </KobalteSelect.ItemLabel>
          <KobalteSelect.ItemIndicator>
            <Icon icon={faCheck} />
          </KobalteSelect.ItemIndicator>
        </KobalteSelect.Item>
      )}
    >
      <Show when={props.label}>
        <KobalteSelect.Label>{props.label}</KobalteSelect.Label>
      </Show>
      <KobalteSelect.HiddenSelect {...selectProps} />
      <KobalteSelect.Trigger>
        <KobalteSelect.Value<Option>>
          {(state) => state.selectedOption().label}
        </KobalteSelect.Value>
        <KobalteSelect.Icon>
          <Icon icon={faCheck} />
        </KobalteSelect.Icon>
      </KobalteSelect.Trigger>
      <KobalteSelect.Portal>
        <KobalteSelect.Content>
          <KobalteSelect.Listbox />
        </KobalteSelect.Content>
      </KobalteSelect.Portal>
      <KobalteSelect.ErrorMessage>{props.error}</KobalteSelect.ErrorMessage>
    </KobalteSelect.Root>
  );
}
