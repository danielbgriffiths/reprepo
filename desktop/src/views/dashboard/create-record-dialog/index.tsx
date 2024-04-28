// Third Party Imports
import { Dialog } from "@kobalte/core";
import Icon from "solid-fa";
import { faTimes } from "@fortawesome/pro-light-svg-icons";
import { styled } from "solid-styled-components";
import {
  createForm,
  valiForm,
  reset,
  getValue,
  setValue,
} from "@modular-forms/solid";
import { createSignal, Show, createResource } from "solid-js";

// Local Imports
import {
  CreateRecordSchema,
  ICreateRecordSchema,
  IFinalCreateRecordSchema,
} from "./schema";
import { FormTitle } from "@components/form/components/form-title";
import { BodyTextVariant, Button, ButtonVariant, Text } from "@services/styles";
import { Loader, LoaderVariant } from "@components/loader";
import { DateField } from "@components/form/components/date-field";
import {
  aiCommands,
  authorMetaCommands,
  compositionMetaCommands,
} from "@services/commands";
import { ToastKey, useToast } from "@services/toast";
import { Repository, AuthorMeta, CompositionMeta } from "@/models";
import { useAuth } from "@services/auth";
import {
  ComboboxField,
  ComboboxOption,
} from "@components/form/components/combobox-field";

interface CreateRecordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (values: IFinalCreateRecordSchema) => void;
  isLoading: boolean;
  repository: Repository;
}

export function CreateRecordDialog(props: CreateRecordDialogProps) {
  //
  // Hooks
  //

  const auth = useAuth();
  const toast = useToast();

  //
  // State
  //

  const [createRecordForm, { Form, Field }] = createForm<ICreateRecordSchema>({
    validate: valiForm(CreateRecordSchema),
  });

  const [allAuthors] = createResource(async () => {
    return await authorMetaCommands.getAuthors({
      field: props.repository.field,
      specialization: props.repository.specialization,
    });
  });
  const [filteredAuthors, setFilteredAuthors] = createSignal<ComboboxOption[]>(
    allAuthors() ?? [],
  );

  const [allNames] = createResource(
    () => filteredAuthors(),
    async () => {
      return await compositionMetaCommands.getNames({
        field: props.repository.field,
        specialization: props.repository.specialization,
        authorMetaIds: filteredAuthors().map((item) => item.value),
      });
    },
  );
  const [filteredNames, setFilteredNames] = createSignal<ComboboxOption[]>(
    allNames() ?? [],
  );
  const [isGenerated, setIsGenerated] = createSignal<boolean>(false);
  const [isGenerating, setIsGenerating] = createSignal<boolean>(false);
  const [authorMeta, setAuthorMeta] = createSignal<AuthorMeta | undefined>();
  const [compositionMeta, setCompositionMeta] = createSignal<
    CompositionMeta | undefined
  >();

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

  async function onClickGenerate(): Promise<void> {
    setIsGenerating(true);

    const result = await aiCommands.generateAuthorCompositionMeta({
      name: getValue(createRecordForm, "name")!,
      author: getValue(createRecordForm, "author")!,
      field: props.repository.field,
      specialization: props.repository.specialization,
    });

    console.log("result: ", result);

    if (!result) {
      toast.register(ToastKey.GetUniversalRecordMetaError, {
        message: `Error generating meta for ${auth.store.user!.firstName}`,
      });
      setIsGenerating(false);
      return;
    }

    setAuthorMeta(result.authorMeta);
    setCompositionMeta(result.compositionMeta);
    setIsGenerating(false);

    setIsGenerated(true);
  }

  function onClickEdit(): void {
    setIsGenerated(false);
  }

  function onAuthorInput(nextValue: string): void {
    setValue(createRecordForm, "author", nextValue);

    setFilteredAuthors((prev) => {
      return prev.filter((author) => author.label.includes(nextValue));
    });
  }

  function onNameInput(nextValue: string): void {
    setValue(createRecordForm, "name", nextValue);

    setFilteredNames((prev) => {
      return prev.filter((name) => name.label.includes(nextValue));
    });
  }

  function onSubmit(values: ICreateRecordSchema): void {
    props.onSubmit({
      startedAt: values.startedAt,
      authorMetaId: authorMeta()!.id,
      compositionMetaId: compositionMeta()!.id,
    });
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
        <Form onSubmit={onSubmit}>
          <Overlay>
            <Content>
              <Header>
                <FormTitle>Record Entry</FormTitle>
                <CloseButton>
                  <Icon icon={faTimes} />
                </CloseButton>
              </Header>
              <FormBody>
                <Field name="author" type="string">
                  {(fieldStore, fieldElementProps) => (
                    <ComboboxField
                      label="Creator / Author / Composer"
                      name={fieldStore.name}
                      placeholder="Frederick Chopin ..."
                      required={true}
                      disabled={isGenerating() || isGenerated()}
                      options={filteredAuthors()}
                      ref={fieldElementProps.ref}
                      onInput={onAuthorInput}
                      onBlur={fieldElementProps.onBlur}
                      error={fieldStore.error}
                    />
                  )}
                </Field>
                <Field name="name" type="string">
                  {(fieldStore, fieldElementProps) => (
                    <ComboboxField
                      label="Record Name"
                      name={fieldStore.name}
                      placeholder="Etude Op. 10 No. 1 ..."
                      required={true}
                      disabled={isGenerating() || isGenerated()}
                      options={filteredNames()}
                      ref={fieldElementProps.ref}
                      onInput={onNameInput}
                      onBlur={fieldElementProps.onBlur}
                      error={fieldStore.error}
                    />
                  )}
                </Field>
                <Show when={!!authorMeta() && !!compositionMeta()}>
                  <div>
                    <ul>
                      <li>
                        <span>Date Authored:</span>
                        <span>{compositionMeta()!.writtenAt}</span>
                      </li>
                      <li>
                        <span>Genre:</span>
                        <span>{compositionMeta()!.genre}</span>
                      </li>
                      <li>
                        <span>Composer Summary:</span>
                        <span>{authorMeta()!.authorSummary}</span>
                      </li>
                      <li>
                        <span>Work Summary:</span>
                        <span>{compositionMeta()!.workSummary}</span>
                      </li>
                    </ul>
                  </div>
                </Show>
                <Field name="startedAt" type="string">
                  {(fieldStore, fieldElementProps) => (
                    <DateField
                      label="Started Learning At"
                      name={fieldStore.name}
                      required={false}
                      defaultValue={new Date().toISOString()}
                      disabled={isGenerating() || isGenerated()}
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
                <Show
                  when={isGenerated()}
                  fallback={
                    <Button
                      type="button"
                      variant={ButtonVariant.Primary}
                      disabled={isGenerating() || createRecordForm.invalid}
                      onClick={onClickGenerate}
                    >
                      <Show when={isGenerating()} fallback={<>Generate</>}>
                        <Loader variant={LoaderVariant.MediumButton} />
                        <Text variant={BodyTextVariant.ButtonText}>
                          Analyzing ...
                        </Text>
                      </Show>
                    </Button>
                  }
                >
                  <Button
                    type="button"
                    disabled={isGenerating() || createRecordForm.submitting}
                    onClick={onClickEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    type="submit"
                    variant={ButtonVariant.Primary}
                    disabled={props.isLoading || createRecordForm.invalid}
                  >
                    <Show
                      when={props.isLoading || createRecordForm.submitting}
                      fallback={<>Approve</>}
                    >
                      <Loader variant={LoaderVariant.MediumButton} />
                      <Text variant={BodyTextVariant.ButtonText}>
                        Processing ...
                      </Text>
                    </Show>
                  </Button>
                </Show>
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
