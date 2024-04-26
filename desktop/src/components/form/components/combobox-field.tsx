// Third Party Imports
import { Combobox } from "@kobalte/core";
import { type JSX, splitProps } from "solid-js";
import Icon from "solid-fa";
import { faCheck, faSort } from "@fortawesome/pro-light-svg-icons";

export interface ComboboxOption {
  value: number;
  label: string;
}

type ComboboxFieldProps = {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  defaultValue?: string;
  error: string;
  multiSelect?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  options: ComboboxOption[];
  ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
  onInput: (str: string) => void;
  onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
};

export function ComboboxField(props: ComboboxFieldProps) {
  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "defaultValue", "required", "disabled", "options"],
    ["placeholder", "ref", "onInput", "onBlur"],
  );

  return (
    <Combobox.Root
      options={rootProps.options}
      optionValue="value"
      optionLabel="label"
      onInputChange={inputProps.onInput}
      validationState={props.error ? "invalid" : "valid"}
      placeholder={inputProps.placeholder}
      itemComponent={(itemProps) => (
        <Combobox.Item item={itemProps.item}>
          <Combobox.ItemLabel>
            {itemProps.item.rawValue.value}
          </Combobox.ItemLabel>
          <Combobox.ItemIndicator>
            <Icon icon={faCheck} />
          </Combobox.ItemIndicator>
        </Combobox.Item>
      )}
    >
      <Combobox.Control aria-label={props.label}>
        <Combobox.Input />
        <Combobox.Trigger>
          <Combobox.Icon>
            <Icon icon={faSort} />
          </Combobox.Icon>
        </Combobox.Trigger>
      </Combobox.Control>
      <Combobox.ErrorMessage>{props.error}</Combobox.ErrorMessage>
      <Combobox.Portal>
        <Combobox.Content>
          <Combobox.Listbox />
        </Combobox.Content>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
