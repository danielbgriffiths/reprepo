import { createForm, required, setValue } from "@modular-forms/solid";
import anime from "animejs/lib/anime.es.js";
import { onMount } from "solid-js";

type AgeForm = {
  age: number;
};

export interface AgeFormProps {
  defaultValue?: number;
  onBack: () => void;
  onSubmit: (age: number) => void;
}

export default function AgeForm(props: AgeFormProps) {
  let formRef: HTMLFormElement | undefined = undefined;

  const [ageForm, { Form, Field }] = createForm<AgeForm>();

  onMount(() => {
    if (!formRef) return;

    if (props.defaultValue) {
      setValue(ageForm, "age", props.defaultValue);
    }

    anime({
      targets: formRef,
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 300,
    });
  });

  function onSubmit(values: AgeForm): void {
    if (!formRef) return;

    anime({
      targets: formRef,
      translateY: [0, 20],
      opacity: [1, 0],
      duration: 300,
      complete: () => {
        props.onSubmit(values.age);
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

  return (
    <Form ref={formRef} onSubmit={onSubmit}>
      <Field
        name="age"
        type="number"
        validate={[
          required("Enter a valid age."),
          (value) =>
            Number(value) < 12 ? "You must be at least 12 years old." : "",
          (value) =>
            Number(value) > 110
              ? "You must be younger than at most 110 years old."
              : "",
        ]}
      >
        {(field, props) => (
          <>
            <label for={field.name}>Age</label>
            <input
              {...props}
              id={field.name}
              value={field.value}
              aria-invalid={!!field.error}
              aria-errormessage={`${props.name}-error`}
              required
            />
            {field.error && <div id={`${props.name}-error`}>{field.error}</div>}
          </>
        )}
      </Field>
      <div>
        <button type="button" disabled={ageForm.submitting} onClick={onBack}>
          Back
        </button>
        <button type="submit" disabled={ageForm.submitting || ageForm.invalid}>
          Next
        </button>
      </div>
    </Form>
  );
}
