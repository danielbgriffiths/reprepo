// Third Party Imports
import { JSXElement } from "solid-js";

// Local Imports
import { ArtistProfile } from "@/models";

export interface ArtistProfileStore {
  activeArtistProfile?: ArtistProfile;
  artistProfiles: ArtistProfile[];
}

export type DataBindings = {
  artistProfile: {
    store: ArtistProfileStore;
    setActiveArtistProfile: (artistProfileId: number) => Promise<void>;
  };
};

export interface DataProviderProps {
  children: JSXElement;
}
