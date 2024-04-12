// Third Party Imports
import { Select as KobalteSelect } from "@kobalte/core";
import {
  createEffect,
  createSignal,
  type JSX,
  Show,
  splitProps,
} from "solid-js";
import Icon from "solid-fa";
import { faCheck } from "@fortawesome/pro-light-svg-icons";
import { styled } from "solid-styled-components";

// Local Imports
import { BodyTextVariant, Text } from "@services/styles";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  options: Option[];
  defaultValue?: Option;
  value?: string;
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
    <Root
      {...rootProps}
      multiple={false}
      defaultValue={props.defaultValue}
      value={getValue()}
      onChange={setValue}
      optionValue="value"
      optionTextValue="label"
      validationState={props.error ? "invalid" : "valid"}
      itemComponent={(
        props: KobalteSelect.SelectRootItemComponentProps<any>,
      ) => (
        <Item item={props.item}>
          <ItemLabel>
            <Text variant={BodyTextVariant.CaptionText}>
              {props.item.textValue}
            </Text>
          </ItemLabel>
          <ItemIndicator>
            <Icon icon={faCheck} />
          </ItemIndicator>
        </Item>
      )}
    >
      <Show when={props.label}>
        <Label>
          <Text variant={BodyTextVariant.CaptionText}>{props.label}</Text>
        </Label>
      </Show>
      <KobalteSelect.HiddenSelect {...selectProps} />
      <Trigger>
        <KobalteSelect.Value<Option>>
          {(state) => state.selectedOption().label}
        </KobalteSelect.Value>
        <TriggerIcon>
          <Icon icon={faCheck} />
        </TriggerIcon>
      </Trigger>
      <KobalteSelect.Portal>
        <KobalteSelect.Content>
          <KobalteSelect.Listbox />
        </KobalteSelect.Content>
      </KobalteSelect.Portal>
      <ErrorMessage>
        <Text variant={BodyTextVariant.CaptionText}>{props.error}</Text>
      </ErrorMessage>
    </Root>
  );
}

const Root = styled(KobalteSelect.Root as any)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Item = styled(KobalteSelect.Item)``;

const ItemLabel = styled(KobalteSelect.ItemLabel)``;

const ItemIndicator = styled(KobalteSelect.ItemIndicator)``;

const Label = styled(KobalteSelect.Label)`
  margin-bottom: 0.4rem;
`;

const Trigger = styled(KobalteSelect.Trigger)`
  min-height: 42px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0 1rem;

  background-color: transparent;
  border: solid 1px grey;
  border-radius: 2px;
`;

const TriggerIcon = styled(KobalteSelect.Icon)``;

const ErrorMessage = styled(KobalteSelect.ErrorMessage)``;
