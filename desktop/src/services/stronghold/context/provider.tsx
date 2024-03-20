// Third Party Imports
import { createEffect, createSignal, onMount } from "solid-js";
import { Client, Stronghold } from "tauri-plugin-stronghold-api";
import { appDataDir } from "@tauri-apps/api/path";

// Local Imports
import { StrongholdProviderProps } from "../index.types";
import {
  MISSING_VARIABLES_ERROR,
  NOT_INITIALIZED_ERROR,
  NO_STORE_ERROR,
} from "../index.config";
import { StrongholdContext } from "./create-context";
import { Commands } from "@services/commands";
import { cmd } from "@services/commands/index.utils";

export function StrongholdProvider(props: StrongholdProviderProps) {
  //
  // State
  //

  const [stronghold, setStronghold] = createSignal<Stronghold>();
  const [client, setClient] = createSignal<Client>();
  const [isInitialized, setIsInitialized] = createSignal<boolean>(false);

  //
  // Lifecycle
  //

  onMount(async () => {
    const vaultFileNameResult = await cmd<string>(Commands.GetEnv, {
      name: "VAULT_FILE_NAME",
    });
    const vaultKeyResult = await cmd<string>(Commands.GetEnv, {
      name: "VAULT_KEY",
    });
    const vaultClientNameResult = await cmd<string>(Commands.GetEnv, {
      name: "VAULT_CLIENT_NAME",
    });

    if (
      vaultFileNameResult.error ||
      vaultKeyResult.error ||
      vaultClientNameResult.error
    ) {
      throw new Error(MISSING_VARIABLES_ERROR);
    }

    const _stronghold = await Stronghold.load(
      `${await appDataDir()}/${vaultFileNameResult.data}`,
      vaultKeyResult.data!,
    );

    let _client!: Client;

    try {
      _client = await _stronghold.loadClient(vaultClientNameResult.data!);
    } catch {
      _client = await _stronghold.createClient(vaultClientNameResult.data!);
    }

    setStronghold(_stronghold);
    setClient(_client);
  });

  createEffect(() => {
    if (!stronghold() || !client()) return;
    setIsInitialized(true);
  });

  //
  // Functions
  //

  async function insert(key: string, value: string): Promise<void> {
    if (!client()) throw new Error(NOT_INITIALIZED_ERROR);
    const store = client()?.getStore();
    if (!store) throw new Error(NO_STORE_ERROR);
    await store.insert(key, Array.from(new TextEncoder().encode(value)));
    console.info(`Stronghold insert ${key}: `, value);
  }

  async function read(key: string): Promise<string | undefined> {
    if (!client()) throw new Error(NOT_INITIALIZED_ERROR);
    const store = client()?.getStore();
    if (!store) throw new Error(NO_STORE_ERROR);
    const data = await store.get(key);
    if (!data) return;
    const response = new TextDecoder().decode(new Uint8Array(data));
    console.info(`Stronghold read ${key}: `, response);
    return response;
  }

  async function save(): Promise<void> {
    await stronghold()?.save();
  }

  async function remove(key: string): Promise<void> {
    if (!client()) throw new Error(NOT_INITIALIZED_ERROR);
    const store = client()?.getStore();
    if (!store) throw new Error(NO_STORE_ERROR);
    await store.remove(key);
    console.info(`Stronghold remove ${key}`);
  }

  return (
    <StrongholdContext.Provider
      value={{
        insert,
        read,
        save,
        remove,
        isInitialized,
      }}
    >
      {props.children}
    </StrongholdContext.Provider>
  );
}
