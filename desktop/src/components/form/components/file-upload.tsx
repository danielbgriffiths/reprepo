// Third Party Imports
import { TextField as KobalteFileUpload } from "@kobalte/core";
import {
  createEffect,
  createSignal,
  type JSX,
  on,
  Show,
  splitProps,
} from "solid-js";
import { FieldElement } from "@modular-forms/solid";
import Icon from "solid-fa";
import { faTrash } from "@fortawesome/pro-light-svg-icons";
import { styled } from "solid-styled-components";

// Local Imports
import { fileCommands } from "@services/commands";

type FileUploadProps = {
  defaultValue?: string | undefined;
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
  value: string | undefined;
  error: string;
  multiline?: boolean | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  ref: (element: HTMLInputElement | HTMLTextAreaElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, FocusEvent>;
  onUpload: (fileURI: string) => void;
  onUploadFail?: (event: Event, fileReaderEvent: Event) => void;
  onDelete: () => void;
  onDeleteFail: () => void;
};

export function FileUpload(props: FileUploadProps) {
  //
  // Setup
  //

  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "value", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );

  //
  // State
  //

  const [fileURI, setFileURI] = createSignal<string | undefined>(
    props.defaultValue,
  );

  //
  // Lifecycle
  //

  createEffect(
    on(fileURI, (nextFileURI) => {
      if (nextFileURI && typeof props.onUpload === "function") {
        props.onUpload(nextFileURI);
      } else if (!nextFileURI && typeof props.onDelete === "function") {
        props.onDelete();
      }
    }),
  );

  //
  // Event Handlers
  //

  function onChange(
    event: Event & { currentTarget: FieldElement; target: Element },
  ) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (fileReaderEvent) => {
      const uploadedFileURI = await fileCommands.uploadFile({
        base64: fileReaderEvent.target?.result as string,
        fileName: "avatar",
      });

      if (!uploadedFileURI && typeof props.onUploadFail === "function") {
        return props.onUploadFail(event, fileReaderEvent);
      }

      setFileURI(uploadedFileURI);
    };

    reader.readAsDataURL(file);
  }

  async function onDelete(): Promise<void> {
    const isDeleted = await fileCommands.deleteFile({
      uri: fileURI(),
    });

    if (!isDeleted && typeof props.onDeleteFail === "function") {
      return props.onDeleteFail();
    }

    setFileURI(undefined);
  }

  return (
    <KobalteFileUpload.Root
      {...rootProps}
      validationState={props.error ? "invalid" : "valid"}
    >
      <Show when={props.label}>
        <KobalteFileUpload.Label>{props.label}</KobalteFileUpload.Label>
      </Show>
      <Show
        when={!fileURI()}
        fallback={
          <UploadPreview>
            <DeleteUploadPreview type="button" onClick={onDelete}>
              <Icon icon={faTrash} />
            </DeleteUploadPreview>
            <UploadPreviewImage alt="avatar preview" src={fileURI()} />
          </UploadPreview>
        }
      >
        <Dropzone>
          <KobalteFileUpload.Input
            onBlur={inputProps.onBlur}
            onChange={onChange}
            id={rootProps.name}
            type="file"
            aria-invalid={!!props.error}
            aria-errormessage={`${rootProps.name}-error`}
          />
          <input
            hidden
            type="text"
            name={rootProps.name}
            ref={inputProps.ref}
            onInput={inputProps.onInput}
            onChange={inputProps.onChange}
          />
          <Show when={props.error}>
            <KobalteFileUpload.ErrorMessage>
              {props.error}
            </KobalteFileUpload.ErrorMessage>
          </Show>
        </Dropzone>
      </Show>
    </KobalteFileUpload.Root>
  );
}

const Dropzone = styled("div")``;
const UploadPreview = styled("div")``;
const DeleteUploadPreview = styled("button")``;
const UploadPreviewImage = styled("img")``;
