// Third Party Imports
import { styled } from "solid-styled-components";

// Local Imports
import { useData } from "@services/data";
import { repositoryCommands } from "@services/commands";
import { useNotifications } from "@services/notifications";
import { useAuth } from "@services/auth";
import { NotificationKey } from "@services/notifications/index.types.ts";

export default function CreateRepository() {
  //
  // Hooks
  //

  const data = useData();
  const notifications = useNotifications();
  const auth = useAuth();

  //
  // Event Handlers
  //

  async function onClickSubmit(_event: MouseEvent): Promise<void> {
    const repository = await repositoryCommands.createRepository({
      field: "Field",
      specialization: "Specialization",
      private: true,
    });

    if (!repository) {
      return notifications.register(NotificationKey.CreateRepositoryError, {
        message: `Error creating repository for ${auth.store.user!.firstName}`,
      });
    }

    notifications.register(NotificationKey.CreateRepositorySuccess, {
      message: `${auth.store.user!.firstName}, your artist profile has been created!`,
    });

    // TODO: With new flow this is not the next action.
    //  We should route to repository or something like that
    await data.repository.setActiveRepository(repository);
  }

  return (
    <Styled.Container>
      <form>
        <h1>CreateRepository</h1>
        <label>
          Field
          <select>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </label>
        <label>
          Specialization Specialization
          <select>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </label>
        <label>
          Do you want to keep your profile private? <sup>*</sup>
          <input type="checkbox" />
        </label>
        <div>
          <button type="submit" onClick={onClickSubmit}>
            Build My Repo
          </button>
        </div>
      </form>
    </Styled.Container>
  );
}

export const Styled = {
  Container: styled.div``,
};
