// Third Party Imports
import { createEffect, createSignal, onMount } from "solid-js";
import { Client, Stronghold } from "tauri-plugin-stronghold-api";
import { appDataDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api";

// Local Imports
import { StrongholdProviderProps } from "../index.types.ts";
import {
  MISSING_VARIABLES_ERROR,
  NOT_INITIALIZED_ERROR,
  NO_STORE_ERROR,
} from "../index.config.ts";
import { StrongholdContext } from "./create-context.tsx";
import { Commands } from "@services/commands";

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
    const VAULT_FILE_NAME = await invoke<string>(Commands.GetEnv, {
      name: "VAULT_FILE_NAME",
    });
    const VAULT_KEY = await invoke<string>(Commands.GetEnv, {
      name: "VAULT_KEY",
    });
    const VAULT_CLIENT_NAME = await invoke<string>(Commands.GetEnv, {
      name: "VAULT_CLIENT_NAME",
    });

    if (!VAULT_FILE_NAME || !VAULT_KEY || !VAULT_CLIENT_NAME) {
      throw new Error(MISSING_VARIABLES_ERROR);
    }

    const _stronghold = await Stronghold.load(
      `${await appDataDir()}/${VAULT_FILE_NAME}`,
      VAULT_KEY!,
    );

    let _client!: Client;

    try {
      _client = await _stronghold.loadClient(VAULT_CLIENT_NAME!);
    } catch {
      _client = await _stronghold.createClient(VAULT_CLIENT_NAME!);
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
    return await store.insert(key, Array.from(new TextEncoder().encode(value)));
  }

  async function read(key: string): Promise<string | undefined> {
    if (!client()) throw new Error(NOT_INITIALIZED_ERROR);
    const store = client()?.getStore();
    if (!store) throw new Error(NO_STORE_ERROR);
    const data = await store.get(key);
    if (!data) return;
    return new TextDecoder().decode(new Uint8Array(data));
  }

  async function save(): Promise<void> {
    await stronghold()?.save();
  }

  async function remove(key: string): Promise<void> {
    if (!client()) throw new Error(NOT_INITIALIZED_ERROR);
    const store = client()?.getStore();
    if (!store) throw new Error(NO_STORE_ERROR);
    await store.remove(key);
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
