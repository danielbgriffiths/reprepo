import {
  createForm,
  FieldElement,
  FieldElementProps,
} from "@modular-forms/solid";
import anime from "animejs/lib/anime.es.js";
import { onMount, createSignal, Show } from "solid-js";

type AvatarForm = {
  avatar: File;
};

export interface AvatarFormProps {
  onBack: () => void;
  onSubmit: (avatar: File) => void;
}

export default function AvatarForm(props: AvatarFormProps) {
  let formRef: HTMLFormElement | undefined = undefined;

  const [avatarForm, { Form, Field }] = createForm<AvatarForm>();
  const [filePreview, setFilePreview] = createSignal<string>();

  onMount(() => {
    if (!formRef) return;

    anime({
      targets: formRef,
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 300,
    });
  });

  function onSubmit(values: AvatarForm): void {
    if (!formRef) return;

    anime({
      targets: formRef,
      translateY: [0, 20],
      opacity: [1, 0],
      duration: 300,
      complete: () => {
        props.onSubmit(values.avatar);
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
        props.onBack();
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

        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };

        reader.readAsDataURL(file);
      }

      onChange(event);
    };
  }

  return (
    <Form ref={formRef} onSubmit={onSubmit}>
      <Field name="avatar" type="File">
        {(field, props) => (
          <>
            <label for={field.name}>Avatar</label>
            <input
              {...props}
              onChange={onChangeWrapped(props.onChange)}
              id={field.name}
              type="file"
              aria-invalid={!!field.error}
              aria-errormessage={`${props.name}-error`}
            />
            {field.error && <div id={`${props.name}-error`}>{field.error}</div>}
            <Show when={filePreview()}>
              <img alt="avatar preview" src={filePreview()} />
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
