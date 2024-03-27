// Third Party Imports
import { createContext } from "solid-js";

// Local Imports
import { DataBindings } from "../index.types";
import { Repository } from "@/models";

export const DataContext = createContext<DataBindings>({
  repository: {
    store: {
      activeRepository: undefined as unknown as Repository,
      repositories: [],
    },
    setActiveRepository: async (_repositoryId: number) => {},
  },
  general: {
    store: {
      accountId: undefined,
    },
    storeAccountId: async (_accountId?: number) => {},
    hydrateAccountId: async () => {},
  },
});
