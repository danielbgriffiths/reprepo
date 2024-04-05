// Third Party Imports
import { styled } from "solid-styled-components";
import { SubmitEvent } from "@modular-forms/solid";

// Local Imports
import { repositoryCommands } from "@services/commands";
import { useNotifications } from "@services/notifications";
import { useAuth } from "@services/auth";
import { NotificationKey } from "@services/notifications/index.types";
import { CreateRepositoryForm } from "./create-repository-form";
import { ICreateRepositorySchema } from "./create-repository-form/schema";

export default function CreateRepository() {
  //
  // Hooks
  //

  const notifications = useNotifications();
  const auth = useAuth();

  //
  // Event Handlers
  //

  async function onSubmit(
    values: ICreateRepositorySchema,
    _event: SubmitEvent,
  ): Promise<void> {
    const repository = await repositoryCommands.createRepository(values);

    if (!repository) {
      return notifications.register(NotificationKey.CreateRepositoryError, {
        message: `Error creating repository for ${auth.store.user!.firstName}`,
      });
    }

    notifications.register(NotificationKey.CreateRepositorySuccess, {
      message: `${auth.store.user!.firstName}, your artist profile has been created!`,
    });

    await auth.setActiveRepositoryId(repository);
  }

  return (
    <Styled.Container>
      <CreateRepositoryForm onSubmit={onSubmit} />
    </Styled.Container>
  );
}

export const Styled = {
  Container: styled.div``,
};
