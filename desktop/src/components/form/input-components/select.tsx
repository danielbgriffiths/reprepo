// Third Party Imports
import { styled } from "solid-styled-components";
import { splitProps } from "solid-js";

// Local Imports
import { InputComponentProps } from "@components/form/types.ts";

export interface SelectOption {
  value: any;
  label: string;
}

export interface SelectProps extends InputComponentProps {
  label: string;
  options: SelectOption[];
}

export function Select(props: SelectProps) {
  const [fieldStore, fieldElementProps, inputProps] = splitProps(
    props,
    ["fieldStore"],
    ["fieldElementProps"],
  );

  return (
    <Styled.Container>
      <Styled.Label for={fieldStore.fieldStore.name}>
        {inputProps.label}
      </Styled.Label>
      <Styled.Select
        {...fieldElementProps.fieldElementProps}
        id={fieldStore.fieldStore.name}
        value={fieldStore.fieldStore.value}
        aria-invalid={!!fieldStore.fieldStore.error}
        aria-errormessage={`${fieldElementProps.fieldElementProps.name}-error`}
        required
      >
        {inputProps.options.map((entry) => (
          <Styled.Option value={entry.value}>{entry.label}</Styled.Option>
        ))}
      </Styled.Select>
      {fieldStore.fieldStore.error && (
        <Styled.ErrorMessage
          id={`${fieldElementProps.fieldElementProps.name}-error`}
        >
          {fieldStore.fieldStore.error}
        </Styled.ErrorMessage>
      )}
    </Styled.Container>
  );
}

const Styled = {
  Container: styled.div``,
  Label: styled.label``,
  Select: styled.select``,
  Option: styled.option``,
  ErrorMessage: styled.span``,
};
