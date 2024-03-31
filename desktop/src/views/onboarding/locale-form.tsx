// Third Party Imports
import { createForm, required, setValue } from "@modular-forms/solid";
import anime from "animejs/lib/anime.es.js";
import { onMount } from "solid-js";

// Local Imports
import { LOCALE_MAP } from "@services/locale/index.config";

type LocaleForm = {
  locale: string;
};

export interface LocaleFormProps {
  defaultValue?: string;
  onSubmit: (locale: string) => void;
}

export default function LocaleForm(props: LocaleFormProps) {
  let formRef: HTMLFormElement | undefined = undefined;

  const [localeForm, { Form, Field }] = createForm<LocaleForm>();

  onMount(() => {
    if (!formRef) return;

    if (props.defaultValue) {
      setValue(localeForm, "locale", props.defaultValue);
    }

    anime({
      targets: formRef,
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 300,
    });
  });

  function onSubmit(values: LocaleForm): void {
    if (!formRef) return;

    anime({
      targets: formRef,
      translateY: [0, 20],
      opacity: [1, 0],
      duration: 300,
      complete: () => {
        props.onSubmit(values.locale);
      },
    });
  }

  return (
    <Form ref={formRef} onSubmit={onSubmit}>
      <Field
        name="locale"
        validate={[required("Make sure to select a locale.")]}
      >
        {(field, props) => (
          <>
            <label for={field.name}>Locale</label>
            <select
              {...props}
              id={field.name}
              value={field.value}
              aria-invalid={!!field.error}
              aria-errormessage={`${props.name}-error`}
              required
            >
              {Object.entries(LOCALE_MAP).map((entry) => (
                <option value={entry[0]}>{entry[1]}</option>
              ))}
            </select>
            {field.error && <div id={`${props.name}-error`}>{field.error}</div>}
          </>
        )}
      </Field>
      <button
        type="submit"
        disabled={localeForm.submitting || localeForm.invalid}
      >
        Next
      </button>
    </Form>
  );
}
