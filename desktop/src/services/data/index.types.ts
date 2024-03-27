// Third Party Imports
import { JSXElement } from "solid-js";

// Local Imports
import { Repository } from "@/models";

export interface RepositoryStore {
  activeRepository?: Repository;
  repositories: Repository[];
}

export interface GeneralStore {
  accountId?: number;
}

export type DataBindings = {
  repository: {
    store: RepositoryStore;
    setActiveRepository: (repositoryId: number) => Promise<void>;
  };
  general: {
    store: GeneralStore;
    storeAccountId: (accountId?: number) => Promise<void>;
    hydrateAccountId: () => Promise<void>;
  };
};

export interface DataProviderProps {
  children: JSXElement;
}
