// Third Party Imports
import { styled } from "solid-styled-components";
import { createSignal, For } from "solid-js";
import { faPlus } from "@fortawesome/pro-light-svg-icons";
import Icon from "solid-fa";

// Local Imports
import { useNavigate } from "@solidjs/router";
import { useAuth } from "@services/auth";
import { Repository } from "@/models";

export default function Repositories() {
  //
  // Hooks
  //

  const auth = useAuth();
  const navigate = useNavigate();

  //
  // State
  //

  const [repositories] = createSignal<Repository[]>([]);

  //
  // Event Handlers
  //

  async function onClickRepository(id: number): Promise<void> {
    await auth.setActiveRepositoryId(id);
    // TODO: Should navigate to dashboard becuase of Auth component createEffect
  }

  function onClickCreateRepository(_event: MouseEvent): void {
    navigate("/auth/repositories/create");
  }

  return (
    <Styled.Container>
      <For
        each={repositories() || []}
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
