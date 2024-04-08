// Third Party Imports
import { createForm, SubmitEvent, valiForm } from "@modular-forms/solid";
import { styled } from "solid-styled-components";

// Local Imports
import { LOCALE_OPTIONS } from "./config";
import { IOnboardingSchema, OnboardingSchema } from "./schema";
import { Select } from "@components/form/components/select";
import { NumberField } from "@components/form/components/number-field";
import { FileUpload } from "@components/form/components/file-upload";
import {
  ButtonVariant,
  HeadingTextVariant,
  Title,
  Button,
} from "@services/styles";

export interface OnboardingFormProps {
  defaultValues: IOnboardingSchema;
  onSubmit: (values: IOnboardingSchema, event: SubmitEvent) => void;
}

export function OnboardingForm(props: OnboardingFormProps) {
  //
  // State
  //

  const [_, { Form, Field }] = createForm<IOnboardingSchema>({
    validate: valiForm(OnboardingSchema),
  });

  return (
    <Form onSubmit={props.onSubmit}>
      <Title variant={HeadingTextVariant.SubTitle}>Create Repository</Title>
      <Field name="locale" type="string">
        {(fieldStore, fieldElementProps) => (
          <Select
            label="Locale"
            options={LOCALE_OPTIONS}
            name={fieldStore.name}
            placeholder="Locale"
            value={props.defaultValues.locale}
            required={true}
            disabled={false}
            ref={fieldElementProps.ref}
            onInput={fieldElementProps.onInput}
            onChange={fieldElementProps.onChange}
            onBlur={fieldElementProps.onBlur}
            error={fieldStore.error}
          />
        )}
      </Field>
      <Field name="age" type="number">
        {(fieldStore, fieldElementProps) => (
          <NumberField
            label="Age"
            name={fieldStore.name}
            placeholder="Age"
            value={props.defaultValues.age}
            required={true}
            disabled={false}
            ref={fieldElementProps.ref}
            onInput={fieldElementProps.onInput}
            onChange={fieldElementProps.onChange}
            onBlur={fieldElementProps.onBlur}
            error={fieldStore.error}
          />
        )}
      </Field>
      <Field name="avatar" type="string">
        {(fieldStore, fieldElementProps) => (
          <FileUpload
            label="Avatar"
            name={fieldStore.name}
            placeholder="Avatar"
            value={props.defaultValues.avatar}
            required={false}
            disabled={false}
            ref={fieldElementProps.ref}
            onInput={fieldElementProps.onInput}
            onChange={fieldElementProps.onChange}
            onBlur={fieldElementProps.onBlur}
            error={fieldStore.error}
            onUpload={() => {}}
            onDelete={() => {}}
            onDeleteFail={() => {}}
            onUploadFail={() => {}}
          />
        )}
      </Field>
      <FormActions>
        <Button type="submit" variant={ButtonVariant.Primary}>
          Complete Onboarding
        </Button>
      </FormActions>
    </Form>
  );
}

const FormActions = styled.div``;
