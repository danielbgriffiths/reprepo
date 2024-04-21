// Third Party Imports
import {
  createForm,
  getValue,
  SubmitEvent,
  valiForm,
} from "@modular-forms/solid";
import { styled, css } from "solid-styled-components";
import { Show } from "solid-js";

// Local Imports
import { FIELD_OPTIONS, SPECIALIZATION_OPTIONS } from "./config";
import { CreateRepositorySchema, ICreateRepositorySchema } from "./schema";
import { Select } from "@components/form/components/select";
import { Switch } from "@components/form/components/switch";
import { BodyTextVariant, Button, ButtonVariant, Text } from "@services/styles";
import { FormTitle } from "@components/form/components/form-title";
import { TextField } from "@components/form/components/text-field";
import { DateField } from "@components/form/components/date-field";
import { Loader, LoaderVariant } from "@components/loader";
import { TextAreaField } from "@components/form/components/text-area-field";

export interface CreateRepositoryFormProps {
  onSubmit: (values: ICreateRepositorySchema, event: SubmitEvent) => void;
  isLoading: boolean;
}

export function CreateRepositoryForm(props: CreateRepositoryFormProps) {
  //
  // State
  //

  const [createRepositoryForm, { Form, Field }] =
    createForm<ICreateRepositorySchema>({
      validate: valiForm(CreateRepositorySchema),
    });

  return (
    <Form onSubmit={props.onSubmit} class={FORM_CSS}>
      <FormTitle>Create Repository</FormTitle>
      <Field name="name" type="string">
        {(fieldStore, fieldElementProps) => (
          <TextField
            label="Repository Name"
            name={fieldStore.name}
            placeholder="Enter repository name"
            defaultValue="My Repository"
            required={true}
            disabled={false}
            type="text"
            ref={fieldElementProps.ref}
            onInput={fieldElementProps.onInput}
            onChange={fieldElementProps.onChange}
            onBlur={fieldElementProps.onBlur}
            error={fieldStore.error}
          />
        )}
      </Field>
      <Field name="description" type="string">
        {(fieldStore, fieldElementProps) => (
          <TextAreaField
            label="Bio"
            name={fieldStore.name}
            placeholder="Tell me about your work..."
            required={true}
            disabled={false}
            type="text"
            ref={fieldElementProps.ref}
            onInput={fieldElementProps.onInput}
            onChange={fieldElementProps.onChange}
            onBlur={fieldElementProps.onBlur}
            error={fieldStore.error}
          />
        )}
      </Field>
      <Field name="field" type="string">
        {(fieldStore, fieldElementProps) => (
          <Select
            label="Field"
            options={FIELD_OPTIONS}
            name={fieldStore.name}
            placeholder="Field"
            value={undefined}
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
      <Field name="specialization" type="string">
        {(fieldStore, fieldElementProps) => (
          <Select
            label="Specialization"
            name={fieldStore.name}
            placeholder="Specialization"
            value={undefined}
            required={true}
            disabled={!getValue(createRepositoryForm, "field")}
            ref={fieldElementProps.ref}
            onInput={fieldElementProps.onInput}
            onChange={fieldElementProps.onChange}
            onBlur={fieldElementProps.onBlur}
            error={fieldStore.error}
            options={
              SPECIALIZATION_OPTIONS.get(
                getValue(createRepositoryForm, "field"),
              ) ?? []
            }
          />
        )}
      </Field>
      <Field name="startDate" type="string">
        {(fieldStore, fieldElementProps) => (
          <DateField
            label="Start Date"
            name={fieldStore.name}
            placeholder="Field"
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
      <Field name="isPrivate" type="string">
        {(fieldStore, fieldElementProps) => (
          <Switch
            label="Private Repository"
            name={fieldStore.name}
            defaultChecked={true}
            value="private"
            required={false}
            disabled={false}
            ref={fieldElementProps.ref}
            onInput={fieldElementProps.onInput}
            onChange={fieldElementProps.onChange}
            onBlur={fieldElementProps.onBlur}
            error={fieldStore.error}
          />
        )}
      </Field>
      <FormActions>
        <Button
          type="submit"
          variant={ButtonVariant.Primary}
          disabled={createRepositoryForm.invalid}
        >
          <Show
            when={props.isLoading || createRepositoryForm.submitting}
            fallback={<>Create Repository</>}
          >
            <Loader variant={LoaderVariant.MediumButton} />
            <Text variant={BodyTextVariant.ButtonText}>Processing ...</Text>
          </Show>
        </Button>
      </FormActions>
    </Form>
  );
}

const FORM_CSS = css`
  width: 100%;
`;

const FormActions = styled.div``;
