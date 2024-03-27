// Third Party Imports
import { styled } from "solid-styled-components";

// Local Imports
import { useData } from "@services/data";
import { cmd } from "@services/commands/index.utils";
import { Commands } from "@services/commands";
import { useNotifications } from "@services/notifications";
import { useAuth } from "@services/auth";

export default function CreateRepository() {
  //
  // Hooks
  //

  const data = useData();
  const [_, notificationActions] = useNotifications();
  const auth = useAuth();

  //
  // Event Handlers
  //

  async function onClickSubmit(_event: MouseEvent): Promise<void> {
    const createRepositoryResult = await cmd<number>(
      Commands.CreateRepository,
      {
        field: "Field",
        specialization: "Specialization",
        private: true,
      },
    );

    if (createRepositoryResult.error) {
      notificationActions.addNotification({
        message: createRepositoryResult.error.message,
        type: "error",
        duration: -1,
        isRemovableByClick: true,
      });
      return;
    }

    notificationActions.addNotification({
      message: `${auth.store.user!.firstName}, your artist profile has been created!`,
      type: "success",
      duration: 5000,
      isRemovableByClick: false,
    });

    await data.repository.setActiveRepository(createRepositoryResult.data!);
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
