// Third Party Imports
import {
  createForm,
  FieldElement,
  SubmitEvent,
  valiForm,
} from "@modular-forms/solid";
import { Show, JSX } from "solid-js";

// Local Imports
import { LOCALE_OPTIONS } from "./config";
import { IOnboardingSchema, OnboardingSchema } from "./schema";
import { Select } from "@components/form/components/select";
import { NumberField } from "@components/form/components/number-field";
import { FileUpload } from "@components/form/components/file-upload";
import {
  BodyTextVariant,
  Button,
  ButtonVariant,
  HeadingTextVariant,
  Text,
} from "@services/styles";
import * as Styled from "./index.styled";
import { SupportedLocale, useLocale } from "@services/locale";
import { Loader, LoaderVariant } from "@components/loader";

export interface OnboardingFormProps {
  defaultValues: IOnboardingSchema;
  onSubmit: (values: IOnboardingSchema, event: SubmitEvent) => void;
  setCrop: (data: Cropper.Data | undefined) => void;
  isLoading: boolean;
}

export function OnboardingForm(props: OnboardingFormProps) {
  //
  // Hooks
  //

  const locale = useLocale();

  //
  // State
  //

  const [formStore, { Form, Field }] = createForm<IOnboardingSchema>({
    validate: valiForm(OnboardingSchema),
    validateOn: "change",
    revalidateOn: "change",
  });

  //
  // Event Handlers
  //

  function onLocaleChangePipe(onChange: JSX.EventHandler<FieldElement, Event>) {
    return (event: any) => {
      const target = event.target as HTMLSelectElement;
      const value = target.value as SupportedLocale | undefined;
      if (!value) return;
      locale.setActiveLocale(value);
      onChange(event);
    };
  }

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
              onChange={onLocaleChangePipe(fieldElementProps.onChange)}
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
          <Button
            type="submit"
            variant={ButtonVariant.Primary}
            disabled={formStore.invalid}
          >
            <Show
              when={props.isLoading || formStore.submitting}
              fallback={<>Complete Onboarding</>}
            >
              <Loader variant={LoaderVariant.MediumButton} />
              <Text variant={BodyTextVariant.ButtonText}>Processing ...</Text>
            </Show>
          </Button>
        </Styled.FormActions>
      </Form>
    </Styled.Wrapper>
  );
}
