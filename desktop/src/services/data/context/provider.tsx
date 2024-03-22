// Third Party Imports
import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";

// Local Imports
import { DataContext } from "./create-context";
import {
  ArtistProfileStore,
  DataBindings,
  DataProviderProps,
} from "../index.types";
import { ArtistProfile } from "@/models";
import { useStronghold } from "@services/stronghold";
import { useAuth } from "@services/auth";
import { StrongholdKeys } from "@services/stronghold/index.config";
import { cmd } from "@services/commands/index.utils";
import { Commands } from "@services/commands";

export function DataProvider(props: DataProviderProps) {
  //
  // Hooks
  //

  const stronghold = useStronghold();
  const [activeUser] = useAuth();

  //
  // State
  //

  const [store, setStore] = createStore<ArtistProfileStore>({
    artistProfiles: [],
    activeArtistProfile: undefined as unknown as ArtistProfile,
  });

  //
  // Functions
  //

  async function setActiveArtistProfile(
    artistProfileId: number,
  ): Promise<void> {
    setStore((prevStore) => ({
      ...prevStore,
      activeArtistProfile: prevStore.artistProfiles.find(
        (artistProfile) => artistProfile.id === artistProfileId,
      ),
    }));

    await stronghold.insert(
      StrongholdKeys.ActiveArtistProfile,
      artistProfileId.toString(),
    );
    await stronghold.save();
  }

  //
  // Lifecycle
  //

  createEffect(async () => {
    if (!activeUser()) {
      setStore("artistProfiles", []);
      setStore("activeArtistProfile", undefined as unknown as ArtistProfile);
      return;
    }

    const artistProfilesResult = await cmd<ArtistProfile[]>(
      Commands.GetArtistProfiles,
      { userId: activeUser()!.id },
    );

    if (artistProfilesResult.error) {
      console.error(artistProfilesResult.error);
      return;
    }

    const activeArtistProfileId = await stronghold.read(
      StrongholdKeys.ActiveArtistProfile,
    );

    if (!activeArtistProfileId) return;

    setStore("artistProfiles", artistProfilesResult.data!);
    setStore(
      "activeArtistProfile",
      artistProfilesResult.data!.find(
        (artistProfile) => artistProfile.id === Number(activeArtistProfileId),
      ),
    );
  });

  const DataBindings: DataBindings = {
    artistProfile: {
      store,
      setActiveArtistProfile,
    },
  };

  return (
    <DataContext.Provider value={DataBindings}>
      {props.children}
    </DataContext.Provider>
  );
}
