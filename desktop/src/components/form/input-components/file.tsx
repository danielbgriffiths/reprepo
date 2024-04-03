// Third Party Imports
import { createEffect, createSignal, Show, splitProps, on } from "solid-js";
import Icon from "solid-fa";
import { faTrash } from "@fortawesome/pro-light-svg-icons";
import { styled } from "solid-styled-components";
import { FieldElement } from "@modular-forms/solid";

// Local Imports
import { InputComponentProps } from "@components/form/types.ts";
import { fileCommands } from "@services/commands";

export interface FileProps extends InputComponentProps {
  label: string;
  onUpload?: (fileURI: string) => void;
  onDelete?: () => void;
  onUploadFail?: (
    event: Event & { currentTarget: FieldElement; target: Element },
    fileReaderEvent: ProgressEvent<FileReader>,
  ) => void;
  onDeleteFail?: () => void;
}

export function File(props: FileProps) {
  //
  // State
  //

  const [fieldStore, fieldElementProps, inputProps] = splitProps(
    props,
    ["fieldStore"],
    ["fieldElementProps"],
  );

  const [fileURI, setFileURI] = createSignal<string | undefined>(
    props.defaultValue,
  );

  //
  // Lifecycle
  //

  createEffect(
    on(fileURI, (nextFileURI) => {
      if (nextFileURI && typeof inputProps.onUpload === "function") {
        inputProps.onUpload(nextFileURI);
      } else if (!nextFileURI && typeof inputProps.onDelete === "function") {
        inputProps.onDelete();
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

      if (!uploadedFileURI && typeof inputProps.onUploadFail === "function") {
        return inputProps.onUploadFail(event, fileReaderEvent);
      }

      setFileURI(uploadedFileURI);
    };

    reader.readAsDataURL(file);
  }

  async function onDelete(): Promise<void> {
    const isDeleted = await fileCommands.deleteFile({
      uri: fileURI(),
    });

    if (!isDeleted && typeof inputProps.onDeleteFail === "function") {
      return inputProps.onDeleteFail();
    }

    setFileURI(undefined);
  }

  return (
    <Styled.Container>
      <Styled.Label for={fieldStore.fieldStore.name}>
        {inputProps.label}
      </Styled.Label>
      <Show
        when={!fileURI()}
        fallback={
          <Styled.Preview>
            <Styled.DeletePreview type="button" onClick={onDelete}>
              <Icon icon={faTrash} />
            </Styled.DeletePreview>
            <Styled.PreviewImg alt="avatar preview" src={fileURI()} />
          </Styled.Preview>
        }
      >
        <Styled.Dropzone>
          <Styled.Input
            autofocus={fieldElementProps.fieldElementProps.autofocus}
            onBlur={fieldElementProps.fieldElementProps.onBlur}
            onChange={onChange}
            id={fieldStore.fieldStore.name}
            type="file"
            aria-invalid={!!fieldStore.fieldStore.error}
            aria-errormessage={`${fieldElementProps.fieldElementProps.name}-error`}
          />
          <input
            hidden
            type="text"
            name={fieldElementProps.fieldElementProps.name}
            ref={fieldElementProps.fieldElementProps.ref}
            onInput={fieldElementProps.fieldElementProps.onInput}
            onChange={fieldElementProps.fieldElementProps.onChange}
          />
          {fieldStore.fieldStore.error && (
            <Styled.ErrorMessage
              id={`${fieldElementProps.fieldElementProps.name}-error`}
            >
              {fieldStore.fieldStore.error}
            </Styled.ErrorMessage>
          )}
        </Styled.Dropzone>
      </Show>
    </Styled.Container>
  );
}

const Styled = {
  Container: styled.div``,
  Label: styled.label``,
  Input: styled.input``,
  Option: styled.option``,
  ErrorMessage: styled.span``,
  Preview: styled.div``,
  PreviewImg: styled.img``,
  DeletePreview: styled.button``,
  Dropzone: styled.div``,
};
