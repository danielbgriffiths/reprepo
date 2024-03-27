// Third Party Imports
import { styled } from "solid-styled-components";
import { For } from "solid-js";
import { faPlus } from "@fortawesome/pro-light-svg-icons";
import Icon from "solid-fa";

// Local Imports
import { useData } from "@services/data";
import { useNavigate } from "@solidjs/router";

export default function Repositories() {
  //
  // Hooks
  //

  const data = useData();
  const navigate = useNavigate();

  //
  // Event Handlers
  //

  async function onClickRepository(id: number): Promise<void> {
    await data.repository.setActiveRepository(id);
    // TODO: Should navigate to dashboard becuase of Auth component createEffect
  }

  function onClickCreateRepository(_event: MouseEvent): void {
    navigate("/auth/repositories/create");
  }

  return (
    <Styled.Container>
      <For
        each={data.repository.store.repositories || []}
        fallback={
          <Styled.FirstRepositoryButton onClick={onClickCreateRepository}>
            <Icon icon={faPlus} />
          </Styled.FirstRepositoryButton>
        }
      >
        {(item) => (
          <div onClick={() => onClickRepository(item.id)}>
            <h3>{item.field}</h3>
            <p>{item.specialization}</p>
          </div>
        )}
      </For>
    </Styled.Container>
  );
}

const Styled = {
  Container: styled.div``,
  FirstRepositoryButton: styled.button``,
};
