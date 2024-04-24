// Third Party Imports
import { TextField as KobalteTextField } from "@kobalte/core";
import { type JSX, Show, splitProps } from "solid-js";
import Quill from "quill";
import { SolidQuill } from "solid-quill";
import { FormStore, setValue } from "@modular-forms/solid";

// Import Local
import "quill/dist/quill.bubble.css";
import "@assets/styles/quill-commit.scss";

type RichTextFieldProps = {
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  defaultValue?: string;
  form: FormStore<any, any>;
  error: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
};

export function RichTextField(props: RichTextFieldProps) {
  //
  // Setup
  //

  let quill!: Quill;
  let rootRef!: HTMLDivElement;

  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "defaultValue", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );

  //
  // Event Handlers
  //

  function onTextChange(): void {
    const text = quill.getText();
    setValue(props.form, props.name, text);
  }

  return (
    <KobalteTextField.Root
      {...rootProps}
      ref={rootRef}
      validationState={props.error ? "invalid" : "valid"}
    >
      <Show when={props.label}>
        <KobalteTextField.Label>{props.label}</KobalteTextField.Label>
      </Show>
      <SolidQuill
        ref={quill}
        onTextChange={onTextChange}
        onReady={console.log}
        onSelectionChange={console.log}
        onEditorChange={console.log}
        debug={false}
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ align: [] }],

            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],

            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["link", "image", "video"],
            [{ color: [] }, { background: [] }],

            ["clean"],
          ],
          clipboard: {
            matchVisual: false,
          },
        }}
        formats={[
          "bold",
          "italic",
          "underline",
          "strike",
          "align",
          "list",
          "indent",
          "size",
          "header",
          "link",
          "image",
          "video",
          "color",
          "background",
          "clean",
        ]}
        placeholder={inputProps.placeholder}
        readOnly={false}
        theme="bubble"
        bounds={rootRef}
      />
      <KobalteTextField.ErrorMessage>
        {props.error}
      </KobalteTextField.ErrorMessage>
    </KobalteTextField.Root>
  );
}
