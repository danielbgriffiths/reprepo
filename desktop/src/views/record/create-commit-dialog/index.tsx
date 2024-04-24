// Third Party Imports
import { Dialog } from "@kobalte/core";
import Icon from "solid-fa";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { styled } from "solid-styled-components";
import { createForm, valiForm, reset } from "@modular-forms/solid";
import { Show } from "solid-js";

// Local Imports
import { CreateCommitSchema, ICreateCommitSchema } from "./schema";
import { FormTitle } from "@components/form/components/form-title";
import { BodyTextVariant, Button, ButtonVariant, Text } from "@services/styles";
import { Loader, LoaderVariant } from "@components/loader";
import { RichTextField } from "@components/form/components/rich-text-field.tsx";
import { TextField } from "@components/form/components/text-field.tsx";

interface CreateCommitDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: ICreateCommitSchema) => void;
  isLoading: boolean;
}

export function CreateCommitDialog(props: CreateCommitDialogProps) {
  //
  // State
  //

  const [createCommitForm, { Form, Field }] = createForm<ICreateCommitSchema>({
    validate: valiForm(CreateCommitSchema),
  });

  //
  // Event Handlers
  //

  function onClickCancel(): void {
    if (!createCommitForm.touched) {
      reset(createCommitForm);
      props.onOpenChange(false);
    } else {
      reset(createCommitForm);
    }
  }

  return (
    <Dialog.Root
      open={props.isOpen}
      onOpenChange={props.onOpenChange}
      modal={true}
      preventScroll={true}
      id="create-commit-dialog"
      translations={{ dismiss: "Close" }}
      forceMount={false}
      defaultOpen={false}
    >
      <Dialog.Portal>
        <Form onSubmit={props.onSubmit}>
          <Overlay>
            <Content>
              <Header>
                <FormTitle>Commit Entry</FormTitle>
                <CloseButton>
                  <Icon icon={faTimes} />
                </CloseButton>
              </Header>
              <FormBody>
                <Field name="title" type="string">
                  {(fieldStore, fieldElementProps) => (
                    <TextField
                      label="Title"
                      name={fieldStore.name}
                      placeholder="Title ..."
                      required={false}
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
                <Field name="notes" type="string">
                  {(fieldStore, fieldElementProps) => (
                    <RichTextField
                      label="Notes"
                      form={createCommitForm}
                      name={fieldStore.name}
                      placeholder="Today I worked ..."
                      required={true}
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
                  disabled={props.isLoading || createCommitForm.submitting}
                  onClick={onClickCancel}
                >
                  {createCommitForm.touched ? "Clear" : "Close"}
                </Button>
                <Button
                  type="submit"
                  variant={ButtonVariant.Primary}
                  disabled={createCommitForm.invalid}
                >
                  <Show
                    when={props.isLoading || createCommitForm.submitting}
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
  width: 100%;
`;

const Footer = styled.footer`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
`;
