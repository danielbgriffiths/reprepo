// Third Party Imports
import {
  createForm,
  FieldElement,
  FieldElementProps,
} from "@modular-forms/solid";
import anime from "animejs/lib/anime.es.js";
import { createSignal, onMount, Show } from "solid-js";
import Icon from "solid-fa";
import { faTrash } from "@fortawesome/pro-light-svg-icons";

// local Imports
import { fileCommands } from "@services/commands";
import { useNotifications } from "@services/notifications";
import { NotificationKey } from "@services/notifications/index.types.ts";

type AvatarForm = {
  avatar: File;
};

export interface AvatarFormProps {
  defaultValue: string | undefined;
  onBack: () => void;
  onSubmit: (avatar: string | undefined) => void;
}

export default function AvatarForm(props: AvatarFormProps) {
  let formRef: HTMLFormElement | undefined = undefined;

  //
  // Hooks
  //

  const notifications = useNotifications();

  //
  // State
  //

  const [avatarForm, { Form, Field }] = createForm<AvatarForm>();
  const [fileURI, setFileURI] = createSignal<string | undefined>(
    props.defaultValue,
  );

  //
  // Lifecylce
  //

  onMount(() => {
    if (!formRef) return;

    anime({
      targets: formRef,
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 300,
    });
  });

  //
  // Functions
  //

  function onSubmit(): void {
    if (!formRef) return;

    anime({
      targets: formRef,
      translateY: [0, 20],
      opacity: [1, 0],
      duration: 300,
      complete: () => {
        props.onSubmit(fileURI());
      },
    });
  }

  function onBack(): void {
    if (!formRef) return;

    anime({
      targets: formRef,
      translateY: [0, -20],
      opacity: [1, 0],
      duration: 300,
      complete: () => {
        if (!fileURI() || fileURI() === props.defaultValue) return;

        fileCommands.deleteFile({ uri: fileURI() }).then(() => {
          setFileURI(undefined);
          props.onBack();
        });
      },
    });
  }

  function onChangeWrapped(onChange: FieldElementProps<any, any>["onChange"]) {
    return (
      event: Event & { currentTarget: FieldElement; target: Element },
    ) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = async (fileReaderEvent) => {
          const uploadedFileURI = await fileCommands.uploadFile({
            base64: fileReaderEvent.target?.result as string,
            fileName: "avatar",
          });

          if (!uploadedFileURI) {
            return notifications.register(NotificationKey.AvatarUploadError);
          }

          notifications.register(NotificationKey.AvatarUploadSuccess);

          setFileURI(uploadedFileURI);
        };

        reader.readAsDataURL(file);
      }

      onChange(event);
    };
  }

  async function onDelete(): Promise<void> {
    const isDeleted = await fileCommands.deleteFile({
      uri: fileURI(),
    });

    if (!isDeleted) {
      return notifications.register(NotificationKey.AvatarDeleteError);
    }

    notifications.register(NotificationKey.AvatarDeleteSuccess);

    setFileURI(undefined);
  }

  return (
    <Form ref={formRef} onSubmit={onSubmit}>
      <Field name="avatar" type="File">
        {(field, props) => (
          <>
            <label for={field.name}>Avatar</label>
            <Show
              when={!fileURI()}
              fallback={
                <div>
                  <button type="button" onClick={onDelete}>
                    <Icon icon={faTrash} />
                  </button>
                  <img alt="avatar preview" src={fileURI()} />
                </div>
              }
            >
              <>
                <input
                  {...props}
                  onChange={onChangeWrapped(props.onChange)}
                  id={field.name}
                  type="file"
                  aria-invalid={!!field.error}
                  aria-errormessage={`${props.name}-error`}
                />
                {field.error && (
                  <div id={`${props.name}-error`}>{field.error}</div>
                )}
              </>
            </Show>
          </>
        )}
      </Field>
      <div>
        <button type="button" disabled={avatarForm.submitting} onClick={onBack}>
          Back
        </button>
        <button
          type="submit"
          disabled={avatarForm.submitting || avatarForm.invalid}
        >
          Finish
        </button>
      </div>
    </Form>
  );
}
