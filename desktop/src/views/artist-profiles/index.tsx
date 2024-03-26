// Third Party Imports
import { styled } from "solid-styled-components";
import { For } from "solid-js";
import { faPlus } from "@fortawesome/pro-light-svg-icons";
import Icon from "solid-fa";

// Local Imports
import { useData } from "@services/data";
import { useNavigate } from "@solidjs/router";

export default function ArtistProfiles() {
  //
  // Hooks
  //

  const data = useData();
  const navigate = useNavigate();

  //
  // Event Handlers
  //

  async function onClickArtistProfile(id: number): Promise<void> {
    await data.artistProfile.setActiveArtistProfile(id);
    // TODO: Should navigate to dashboard becuase of Auth component createEffect
  }

  function onClickCreateArtistProfile(_event: MouseEvent): void {
    navigate("/auth/artist-profiles/create");
  }

  return (
    <Styled.Container>
      <For
        each={data.artistProfile.store.artistProfiles || []}
        fallback={
          <Styled.FirstArtistProfileButton onClick={onClickCreateArtistProfile}>
            <Icon icon={faPlus} />
          </Styled.FirstArtistProfileButton>
        }
      >
        {(item) => (
          <div onClick={() => onClickArtistProfile(item.id)}>
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
  FirstArtistProfileButton: styled.button``,
};
