import {
  createForm,
  FieldElement,
  FieldElementProps,
} from "@modular-forms/solid";
import anime from "animejs/lib/anime.es.js";
import { createSignal, onMount, Show } from "solid-js";
import Icon from "solid-fa";
import { faTrash } from "@fortawesome/pro-light-svg-icons";

import { cmd } from "@services/commands/index.utils";
import { Commands } from "@services/commands";
import { useNotifications } from "@services/notifications";

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

  const [_, notificationActions] = useNotifications();

  const [avatarForm, { Form, Field }] = createForm<AvatarForm>();
  const [fileURI, setFileURI] = createSignal<string | undefined>(
    props.defaultValue,
  );

  onMount(() => {
    if (!formRef) return;

    anime({
      targets: formRef,
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 300,
    });
  });

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

        cmd<boolean>(Commands.DeleteFile, { uri: fileURI() }).then(() => {
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
          const uploadFileResult = await cmd<string>(Commands.UploadFile, {
            base64: fileReaderEvent.target?.result as string,
            fileName: "avatar",
          });

          if (uploadFileResult.error) {
            return notificationActions.addNotification({
              type: "error",
              message: uploadFileResult.error.message,
              duration: -1,
              isRemovableByClick: true,
            });
          }

          notificationActions.addNotification({
            type: "success",
            message: "Avatar Uploaded!",
            duration: 2000,
            isRemovableByClick: true,
          });

          setFileURI(fileReaderEvent.target?.result as string);
        };

        reader.readAsDataURL(file);
      }

      onChange(event);
    };
  }

  async function onDelete(): Promise<void> {
    const deleteFileResult = await cmd<boolean>(Commands.DeleteFile, {
      uri: fileURI(),
    });

    if (deleteFileResult.error) {
      return notificationActions.addNotification({
        type: "error",
        message: deleteFileResult.error.message,
        duration: -1,
        isRemovableByClick: true,
      });
    }

    notificationActions.addNotification({
      type: "success",
      message: "Avatar Deleted!",
      duration: 2000,
      isRemovableByClick: true,
    });

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
