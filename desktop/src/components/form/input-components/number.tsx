// Third Party Imports
import { styled } from "solid-styled-components";
import { splitProps } from "solid-js";

// Local Imports
import { InputComponentProps } from "@components/form/types.ts";

export interface NumberProps extends InputComponentProps {
  label: string;
}

export function Number(props: NumberProps) {
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
      <Styled.Input
        {...fieldElementProps.fieldElementProps}
        id={fieldStore.fieldStore.name}
        type="number"
        value={fieldStore.fieldStore.value}
        aria-invalid={!!fieldStore.fieldStore.error}
        aria-errormessage={`${fieldElementProps.fieldElementProps.name}-error`}
        required={inputProps.isRequired}
      />
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
  Input: styled.input``,
  Option: styled.option``,
  ErrorMessage: styled.span``,
};
