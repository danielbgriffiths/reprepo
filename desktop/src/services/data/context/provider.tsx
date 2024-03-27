// Third Party Imports
import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";

// Local Imports
import { DataContext } from "./create-context";
import {
  DataBindings,
  DataProviderProps,
  GeneralStore,
  RepositoryStore,
} from "../index.types";
import { Repository } from "@/models";
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
  const auth = useAuth();

  //
  // State
  //

  const [repositoryStore, setRepositoryStore] = createStore<RepositoryStore>({
    repositories: [],
    activeRepository: undefined as unknown as Repository,
  });
  const [generalStore, setGeneralStore] = createStore<GeneralStore>({
    accountId: undefined,
  });

  //
  // Functions
  //

  async function setActiveRepository(repositoryId: number): Promise<void> {
    setRepositoryStore((prevStore) => ({
      ...prevStore,
      activeRepository: prevStore.repositories.find(
        (repository) => repository.id === repositoryId,
      ),
    }));

    await stronghold.insertWithParse(
      StrongholdKeys.ActiveRepository,
      {
        key: auth.store.user!.id,
        value: repositoryId.toString(),
      },
      { save: true },
    );
  }

  async function storeAccountId(accountId?: number): Promise<void> {
    if (!accountId) {
      return await stronghold.remove(StrongholdKeys.AccountId, { save: true });
    }

    await stronghold.insert(StrongholdKeys.AccountId, String(accountId), {
      save: true,
    });

    const savedAccountId = await stronghold.read(StrongholdKeys.AccountId);

    setGeneralStore(
      "accountId",
      savedAccountId ? Number(savedAccountId) : undefined,
    );
  }

  async function hydrateAccountId(): Promise<void> {
    const savedAccountId = await stronghold.read(StrongholdKeys.AccountId);

    if (!savedAccountId) return;

    setGeneralStore("accountId", Number(savedAccountId));
  }

  //
  // Lifecycle
  //

  createEffect(async () => {
    if (!auth.store.auth) {
      setRepositoryStore("repositories", []);
      setRepositoryStore(
        "activeRepository",
        undefined as unknown as Repository,
      );
      return;
    }

    const repositoriesResult = await cmd<Repository[]>(
      Commands.GetRepositories,
      { userId: auth.store.user!.id },
    );

    if (repositoriesResult.error) {
      console.error(repositoriesResult.error);
      return;
    }

    const activeRepositoryId = await stronghold.readWithParse(
      StrongholdKeys.ActiveRepository,
      auth.store.user!.id,
    );

    if (!activeRepositoryId) return;

    setRepositoryStore("repositories", repositoriesResult.data!);
    setRepositoryStore(
      "activeRepository",
      repositoriesResult.data!.find(
        (repository) => repository.id === Number(activeRepositoryId),
      ),
    );
  });

  const DataBindings: DataBindings = {
    repository: {
      store: repositoryStore,
      setActiveRepository,
    },
    general: {
      store: generalStore,
      storeAccountId,
      hydrateAccountId,
    },
  };

  return (
    <DataContext.Provider value={DataBindings}>
      {props.children}
    </DataContext.Provider>
  );
}
