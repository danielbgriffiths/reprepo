// Third Party Imports
import {
  createForm,
  getValue,
  SubmitEvent,
  valiForm,
} from "@modular-forms/solid";
import { styled, css } from "solid-styled-components";

// Local Imports
import { FIELD_OPTIONS, SPECIALIZATION_OPTIONS } from "./config";
import { CreateRepositorySchema, ICreateRepositorySchema } from "./schema";
import { Select } from "@components/form/components/select";
import { Switch } from "@components/form/components/switch";
import { Button, ButtonVariant } from "@services/styles";
import { FormTitle } from "@components/form/components/form-title.tsx";

export interface CreateRepositoryFormProps {
  onSubmit: (values: ICreateRepositorySchema, event: SubmitEvent) => void;
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
      <Field name="isPrivate" type="boolean">
        {(fieldStore, fieldElementProps) => (
          <Switch
            label="Private Repository"
            name={fieldStore.name}
            checked={false}
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
        <Button type="submit" variant={ButtonVariant.Primary}>
          Create Repository
        </Button>
      </FormActions>
    </Form>
  );
}

const FORM_CSS = css`
  width: 100%;
`;

const FormActions = styled.div``;
