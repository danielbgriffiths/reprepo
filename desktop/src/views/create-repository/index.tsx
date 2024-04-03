// Third Party Imports
import { styled } from "solid-styled-components";

// Local Imports
import { repositoryCommands } from "@services/commands";
import { useNotifications } from "@services/notifications";
import { useAuth } from "@services/auth";
import { NotificationKey } from "@services/notifications/index.types";
import { createForm, required } from "@modular-forms/solid";

export default function CreateRepository() {
  //
  // Hooks
  //

  const notifications = useNotifications();
  const auth = useAuth();

  //
  // State
  //

  const [createRepositoryForm, { Form, Field }] =
    createForm<CreateRepositoryForm>();

  //
  // Event Handlers
  //

  async function onSubmit(_event: MouseEvent): Promise<void> {
    const repository = await repositoryCommands.createRepository({
      field: "Field",
      specialization: "Specialization",
      private: true,
    });

    if (!repository) {
      return notifications.register(NotificationKey.CreateRepositoryError, {
        message: `Error creating repository for ${auth.store.user!.firstName}`,
      });
    }

    notifications.register(NotificationKey.CreateRepositorySuccess, {
      message: `${auth.store.user!.firstName}, your artist profile has been created!`,
    });

    await auth.setActiveRepositoryId(repository);
  }

  return (
    <Styled.Container>
      <Form onSubmit={onSubmit}>
        <h1>CreateRepository</h1>
        <div>
          <Field
            name="field"
            validate={[required("Make sure to select a field.")]}
          >
            {(field, props) => (
              <>
                <label for={field.name}>Field</label>
                <select
                  {...props}
                  id={field.name}
                  value={field.value}
                  aria-invalid={!!field.error}
                  aria-errormessage={`${props.name}-error`}
                  required
                >
                  {Object.entries(FIELDS_MAP).map((entry) => (
                    <option value={entry[0]}>{entry[1]}</option>
                  ))}
                </select>
                {field.error && (
                  <div id={`${props.name}-error`}>{field.error}</div>
                )}
              </>
            )}
          </Field>
          <Field
            name="specialization"
            validate={[required("Make sure to select a specialization.")]}
          >
            {(field, props) => (
              <>
                <label for={field.name}>Specialization</label>
                <select
                  {...props}
                  id={field.name}
                  value={field.value}
                  aria-invalid={!!field.error}
                  aria-errormessage={`${props.name}-error`}
                  required
                >
                  {Object.entries(SPECIALIZATIONS_MAP).map((entry) => (
                    <option value={entry[0]}>{entry[1]}</option>
                  ))}
                </select>
                {field.error && (
                  <div id={`${props.name}-error`}>{field.error}</div>
                )}
              </>
            )}
          </Field>
          <Field name="isPrivate" type="boolean">
            {(field, props) => (
              <>
                <label for={field.name}>
                  Do you want to keep your profile private?
                </label>
                <input {...props} type="checkbox" checked={field.value} />
                {field.error && (
                  <div id={`${props.name}-error`}>{field.error}</div>
                )}
              </>
            )}
          </Field>
        </div>
        <div>
          <button type="submit">Build My Repo</button>
        </div>
      </Form>
    </Styled.Container>
  );
}

export const Styled = {
  Container: styled.div``,
};
