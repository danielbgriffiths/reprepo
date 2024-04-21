// Third Party Imports
import { Dialog } from "@kobalte/core";
import Icon from "solid-fa";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { styled } from "solid-styled-components";
import { createForm, valiForm, reset } from "@modular-forms/solid";
import { Show } from "solid-js";

// Local Imports
import { CreateRecordSchema, ICreateRecordSchema } from "./schema";
import { FormTitle } from "@components/form/components/form-title";
import { TextField } from "@components/form/components/text-field.tsx";
import { BodyTextVariant, Button, ButtonVariant, Text } from "@services/styles";
import { Loader, LoaderVariant } from "@components/loader";
import { DateField } from "@components/form/components/date-field.tsx";

interface CreateRecordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: ICreateRecordSchema) => void;
  isLoading: boolean;
}

export function CreateRecordDialog(props: CreateRecordDialogProps) {
  //
  // State
  //

  const [createRecordForm, { Form, Field }] = createForm<ICreateRecordSchema>({
    validate: valiForm(CreateRecordSchema),
  });

  //
  // Event Handlers
  //

  function onClickCancel(): void {
    if (!createRecordForm.touched) {
      reset(createRecordForm);
      props.onOpenChange(false);
    } else {
      reset(createRecordForm);
    }
  }

  return (
    <Dialog.Root
      open={props.isOpen}
      onOpenChange={props.onOpenChange}
      modal={true}
      preventScroll={true}
      id="create-record-dialog"
      translations={{ dismiss: "Close" }}
      forceMount={false}
      defaultOpen={false}
    >
      <Dialog.Portal>
        <Form onSubmit={props.onSubmit}>
          <Overlay>
            <Content>
              <Header>
                <FormTitle>Create Repository</FormTitle>
                <CloseButton>
                  <Icon icon={faTimes} />
                </CloseButton>
              </Header>
              <FormBody>
                <Field name="name" type="string">
                  {(fieldStore, fieldElementProps) => (
                    <TextField
                      label="Record Name"
                      name={fieldStore.name}
                      placeholder="Etude Op. 10 No. 1 ..."
                      required={true}
                      disabled={false}
                      type="text"
                      ref={fieldElementProps.ref}
                      onInput={fieldElementProps.onInput}
                      onChange={fieldElementProps.onChange}
                      onBlur={fieldElementProps.onBlur}
                      error={fieldStore.error}
                    />
                  )}
                </Field>
                <Field name="author" type="string">
                  {(fieldStore, fieldElementProps) => (
                    <TextField
                      label="Creator / Author / Composer"
                      name={fieldStore.name}
                      placeholder="Frederick Chopin ..."
                      required={true}
                      disabled={false}
                      type="text"
                      ref={fieldElementProps.ref}
                      onInput={fieldElementProps.onInput}
                      onChange={fieldElementProps.onChange}
                      onBlur={fieldElementProps.onBlur}
                      error={fieldStore.error}
                    />
                  )}
                </Field>
                <Field name="category" type="string">
                  {(fieldStore, fieldElementProps) => (
                    <TextField
                      label="Genre / Category / Period"
                      name={fieldStore.name}
                      placeholder="Romantic ..."
                      required={true}
                      disabled={false}
                      type="text"
                      ref={fieldElementProps.ref}
                      onInput={fieldElementProps.onInput}
                      onChange={fieldElementProps.onChange}
                      onBlur={fieldElementProps.onBlur}
                      error={fieldStore.error}
                    />
                  )}
                </Field>
                <Field name="authoredAt" type="string">
                  {(fieldStore, fieldElementProps) => (
                    <DateField
                      label="Date of Publication"
                      name={fieldStore.name}
                      required={false}
                      disabled={false}
                      ref={fieldElementProps.ref}
                      onInput={fieldElementProps.onInput}
                      onChange={fieldElementProps.onChange}
                      onBlur={fieldElementProps.onBlur}
                      error={fieldStore.error}
                    />
                  )}
                </Field>
                <Field name="startedAt" type="string">
                  {(fieldStore, fieldElementProps) => (
                    <DateField
                      label="Started Learning At"
                      name={fieldStore.name}
                      required={false}
                      disabled={false}
                      ref={fieldElementProps.ref}
                      onInput={fieldElementProps.onInput}
                      onChange={fieldElementProps.onChange}
                      onBlur={fieldElementProps.onBlur}
                      error={fieldStore.error}
                    />
                  )}
                </Field>
              </FormBody>
              <Footer>
                <Button
                  type="button"
                  disabled={props.isLoading || createRecordForm.submitting}
                  onClick={onClickCancel}
                >
                  {createRecordForm.touched ? "Clear" : "Close"}
                </Button>
                <Button
                  type="submit"
                  variant={ButtonVariant.Primary}
                  disabled={createRecordForm.invalid}
                >
                  <Show
                    when={props.isLoading || createRecordForm.submitting}
                    fallback={<>Create</>}
                  >
                    <Loader variant={LoaderVariant.MediumButton} />
                    <Text variant={BodyTextVariant.ButtonText}>
                      Processing ...
                    </Text>
                  </Show>
                </Button>
              </Footer>
            </Content>
          </Overlay>
        </Form>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(3, 3, 3, 0.42);
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled(Dialog.Content)`
  max-width: max(480px, 60vw);
  min-width: max(280px, 30vw);
  max-height: max(360px, 80vh);
  min-height: max(120px, 20vh);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  border-bottom: solid 1px rgba(3, 3, 3, 0.22);
`;

const CloseButton = styled(Dialog.CloseButton)``;

const FormBody = styled.section`
  padding: 1rem;
`;

const Footer = styled.footer`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
`;
