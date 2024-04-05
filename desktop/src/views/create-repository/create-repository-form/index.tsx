import {
  createForm,
  getValue,
  SubmitEvent,
  valiForm,
} from "@modular-forms/solid";
import { styled } from "solid-styled-components";

import { FIELD_OPTIONS, SPECIALIZATION_OPTIONS } from "./config";
import { CreateRepositorySchema, ICreateRepositorySchema } from "./schema";
import { Select } from "@components/form/input-components/select.tsx";
import { Toggle } from "@components/form/input-components/toggle.tsx";

export interface CreateRepositoryFormProps {
  onSubmit: (values: ICreateRepositorySchema, event: SubmitEvent) => void;
}

export function CreateRepositoryForm(props: CreateRepositoryFormProps) {
  const [createRepositoryForm, { Form, Field }] =
    createForm<ICreateRepositorySchema>({
      validate: valiForm(CreateRepositorySchema),
    });

  return (
    <Form onSubmit={props.onSubmit}>
      <Styled.FormTitle>Create Repository</Styled.FormTitle>
      <Field name="field" type="string">
        {(fieldStore, fieldElementProps) => (
          <Select
            fieldStore={fieldStore}
            fieldElementProps={fieldElementProps}
            label="Field"
            options={FIELD_OPTIONS}
          />
        )}
      </Field>
      <Field name="specialization" type="string">
        {(fieldStore, fieldElementProps) => (
          <Select
            fieldStore={fieldStore}
            fieldElementProps={fieldElementProps}
            label="Specialization"
            isDisabled={!getValue(createRepositoryForm, "field")}
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
          <Toggle
            fieldStore={fieldStore}
            fieldElementProps={fieldElementProps}
            label="Private Repository"
          />
        )}
      </Field>
      <Styled.FormAction>
        <Styled.SubmitButton type="submit">
          Create Repository
        </Styled.SubmitButton>
      </Styled.FormAction>
    </Form>
  );
}

const Styled = {
  FormTitle: styled.h1``,
  FormAction: styled.div``,
  SubmitButton: styled.button``,
};
