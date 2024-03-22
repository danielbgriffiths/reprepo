// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { DataBindings } from "../index.types";
import { ArtistProfile } from "@/models";

export const DataContext = createContext<DataBindings>({
  artistProfile: {
    store: {
      activeArtistProfile: undefined as unknown as ArtistProfile,
      artistProfiles: [],
    },
    setActiveArtistProfile: async (_artistProfileId: number) => {},
  },
});
