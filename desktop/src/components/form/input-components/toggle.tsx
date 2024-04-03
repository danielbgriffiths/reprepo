// Third Party Imports
import { styled } from "solid-styled-components";
import { splitProps } from "solid-js";

// Local Imports
import { InputComponentProps } from "@components/form/types.ts";

export interface ToggleProps extends InputComponentProps {
  label: string;
}

export function Toggle(props: ToggleProps) {
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
      <Styled.Toggle>
        <Styled.Input
          {...fieldElementProps.fieldElementProps}
          id={fieldStore.fieldStore.name}
          type="checkbox"
          value={fieldStore.fieldStore.value}
          aria-invalid={!!fieldStore.fieldStore.error}
          aria-errormessage={`${fieldElementProps.fieldElementProps.name}-error`}
          required={inputProps.isRequired}
        />
        <Styled.Slider />
      </Styled.Toggle>
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
  Toggle: styled.div``,
  Slider: styled.span``,
};
