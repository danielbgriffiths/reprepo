// Third Party Imports
import { createForm, SubmitEvent, valiForm } from "@modular-forms/solid";

// Local Imports
import { LOCALE_OPTIONS } from "./config";
import { IOnboardingSchema, OnboardingSchema } from "./schema";
import { Select } from "@components/form/components/select";
import { NumberField } from "@components/form/components/number-field";
import { FileUpload } from "@components/form/components/file-upload";
import { ButtonVariant, HeadingTextVariant, Button } from "@services/styles";
import * as Styled from "./index.styled";

export interface OnboardingFormProps {
  defaultValues: IOnboardingSchema;
  onSubmit: (values: IOnboardingSchema, event: SubmitEvent) => void;
  setCrop: (data: Cropper.Data | undefined) => void;
}

export function OnboardingForm(props: OnboardingFormProps) {
  //
  // State
  //

  const [formStore, { Form, Field }] = createForm<IOnboardingSchema>({
    validate: valiForm(OnboardingSchema),
    validateOn: "change",
    revalidateOn: "change",
  });

  return (
    <Styled.Wrapper>
      <Form onSubmit={props.onSubmit}>
        <Styled.Title variant={HeadingTextVariant.SubTitle}>
          Onboarding
        </Styled.Title>
        <Field name="locale" type="string">
          {(fieldStore, fieldElementProps) => (
            <Select
              label="Locale"
              options={LOCALE_OPTIONS}
              defaultValue={LOCALE_OPTIONS.find(
                (option) => option.value === props.defaultValues.locale,
              )}
              name={fieldStore.name}
              placeholder="Locale"
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
              defaultValue={props.defaultValues.age}
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
              defaultValue={props.defaultValues.avatar}
              required={false}
              disabled={false}
              ref={fieldElementProps.ref}
              onInput={fieldElementProps.onInput}
              onChange={fieldElementProps.onChange}
              onBlur={fieldElementProps.onBlur}
              error={fieldStore.error}
              acceptedMimeTypes={["image/png", "image/jpeg", "image/jpg"]}
              isMultiple={false}
              onUpload={() => {}}
              onDelete={() => {}}
              onDeleteFail={() => {}}
              onUploadFail={() => {}}
              formStore={formStore}
              onCrop={props.setCrop}
              cropAspectRatio={1}
            />
          )}
        </Field>
        <Styled.FormActions>
          <Button type="submit" variant={ButtonVariant.Primary}>
            Complete Onboarding
          </Button>
        </Styled.FormActions>
      </Form>
    </Styled.Wrapper>
  );
}
