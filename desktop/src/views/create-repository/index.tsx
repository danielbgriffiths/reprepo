// Third Party Imports
import { styled } from "solid-styled-components";
import { SubmitEvent } from "@modular-forms/solid";
import { createSignal } from "solid-js";

// Local Imports
import { repositoryCommands } from "@services/commands";
import { useToast, ToastKey } from "@services/toast";
import { useAuth } from "@services/auth";
import { CreateRepositoryForm } from "./create-repository-form";
import { ICreateRepositorySchema } from "./create-repository-form/schema";

export default function CreateRepository() {
  //
  // Hooks
  //

  const toast = useToast();
  const auth = useAuth();

  //
  // State
  //

  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  //
  // Event Handlers
  //

  async function onSubmit(
    values: ICreateRepositorySchema,
    _event: SubmitEvent,
  ): Promise<void> {
    setIsLoading(true);

    const repository = await repositoryCommands.createRepository({
      newRepository: {
        name: values.name,
        field: values.field,
        specialization: values.specialization,
        description: values.description,
        social_links: [],
        startDate: values.startDate,
        isPrivate: values.isPrivate === "private",
        userId: auth.store.user!.id,
      },
    });

    if (!repository) {
      toast.register(ToastKey.CreateRepositoryError, {
        message: `Error creating repository for ${auth.store.user!.firstName}`,
      });
      setIsLoading(false);
      return;
    }

    toast.register(ToastKey.CreateRepositorySuccess, {
      message: `${auth.store.user!.firstName}, your artist profile has been created!`,
    });
    setIsLoading(false);

    await auth.setActiveRepositoryId(repository);
  }

  return (
    <Container>
      <CreateRepositoryForm onSubmit={onSubmit} isLoading={isLoading()} />
    </Container>
  );
}

const Container = styled.div`
  margin: 0 auto;
  max-width: 640px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
