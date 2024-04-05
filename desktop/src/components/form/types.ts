import { FieldElementProps, FieldStore } from "@modular-forms/solid";

export interface InputComponentProps {
  fieldStore: FieldStore<any, any>;
  fieldElementProps: FieldElementProps<any, any>;
  isRequired?: boolean;
  isDisabled?: boolean;
  defaultValue?: any;
}
