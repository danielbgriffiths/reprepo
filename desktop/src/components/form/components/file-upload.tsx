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
import { FieldElement, FormStore, setValue } from "@modular-forms/solid";
import Icon from "solid-fa";
import { faTrash } from "@fortawesome/pro-light-svg-icons";
import { styled } from "solid-styled-components";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

// Local Imports
import { BodyTextVariant, Text } from "@services/styles";

type FileUploadProps = {
  defaultValue?: string | undefined;
  name: string;
  label?: string | undefined;
  placeholder?: string | undefined;
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
  onCrop: (data: Cropper.Data | undefined) => void;
  formStore: FormStore<any, any>;
  acceptedMimeTypes?: string[];
  isMultiple?: boolean;
  cropAspectRatio?: number;
};

export function FileUpload(props: FileUploadProps) {
  //
  // Setup
  //

  let imageRef!: HTMLImageElement;

  const [rootProps, inputProps] = splitProps(
    props,
    ["name", "required", "disabled"],
    ["placeholder", "ref", "onInput", "onChange", "onBlur"],
  );

  //
  // State
  //

  const [fileURI, setFileURI] = createSignal<string | undefined>(
    props.defaultValue,
  );
  const [isDragging, setIsDragging] = createSignal<boolean>(false);

  //
  // Lifecycle
  //

  createEffect(
    on(fileURI, (nextFileURI) => {
      setValue(props.formStore, props.name, nextFileURI);

      if (nextFileURI && typeof props.onUpload === "function") {
        props.onUpload(nextFileURI);
      } else if (!nextFileURI && typeof props.onDelete === "function") {
        props.onDelete();
        props.onCrop(undefined);
      }

      if (!nextFileURI) return;

      new Cropper(imageRef, {
        aspectRatio: props.cropAspectRatio,
        crop: (event) => props.onCrop(event.detail),
      });
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
    handleFileRead(event, file);
  }

  async function onDelete(): Promise<void> {
    setFileURI(undefined);
  }

  function onDrop(event: DragEvent): void {
    event.preventDefault();

    if (event.dataTransfer?.items) {
      [...event.dataTransfer.items].forEach((item) => {
        if (item.kind !== "file") return;
        handleFileRead(event, item.getAsFile() ?? undefined);
      });
    } else {
      [...(event.dataTransfer?.files || [])].forEach((file) => {
        handleFileRead(event, file);
      });
    }
  }

  function onDragEnter(event: DragEvent): void {
    event.preventDefault();
    setIsDragging(true);
  }

  function onDragExit(event: DragEvent): void {
    event.preventDefault();
    setIsDragging(false);
  }

  //
  // Functions
  //

  function handleFileRead(_event: Event, file: File | undefined): void {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (fileReaderEvent) => {
      setFileURI(fileReaderEvent.target?.result! as string);
    };

    reader.readAsDataURL(file);
  }

  return (
    <Root {...rootProps} validationState={props.error ? "invalid" : "valid"}>
      <Show when={props.label}>
        <Label>{props.label}</Label>
      </Show>
      <Show
        when={!fileURI()}
        fallback={
          <UploadPreview>
            <DeleteUploadPreview type="button" onClick={onDelete}>
              <Icon icon={faTrash} />
            </DeleteUploadPreview>
            <UploadPreviewImage
              ref={imageRef}
              alt="avatar preview"
              src={fileURI()}
            />
          </UploadPreview>
        }
      >
        <Dropzone
          isDragging={isDragging()}
          onDrop={onDrop}
          onDragEnter={onDragEnter}
          onDragLeave={onDragExit}
        >
          <Input
            onChange={onChange}
            type="file"
            accept={props.acceptedMimeTypes?.join(",")}
            multiple={props.isMultiple}
          />
          <DropzoneText variant={BodyTextVariant.ButtonText}>
            Drag one or more files to this <i>drop zone</i> or click to select
            files.
          </DropzoneText>
          <KobalteFileUpload.Input
            hidden
            aria-hidden={true}
            aria-invalid={!!props.error}
            aria-errormessage={`${rootProps.name}-error`}
            type="text"
            id={rootProps.name}
            name={rootProps.name}
            ref={inputProps.ref}
            onBlur={inputProps.onBlur}
            onInput={inputProps.onInput}
            onChange={inputProps.onChange}
          />
        </Dropzone>
      </Show>
      <ErrorMessage>
        <Text variant={BodyTextVariant.CaptionText}>{props.error}</Text>
      </ErrorMessage>
    </Root>
  );
}

const Root = styled(KobalteFileUpload.Root)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const Label = styled(KobalteFileUpload.Label)`
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  width: 100%;
  height: 120px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
`;

const ErrorMessage = styled(KobalteFileUpload.ErrorMessage)``;

const Dropzone = styled.div<{ isDragging: boolean }>`
  width: 100%;
  height: 120px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  border: 2px dashed;
  background-color: ${(props) =>
    props.isDragging ? "#f0f0f0" : "transparent"};
`;

const DropzoneText = styled(Text)``;

const UploadPreview = styled.div`
  width: 100%;
  min-height: 120px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DeleteUploadPreview = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: transparent;
`;

const UploadPreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 340px;
`;
