// Third Party Imports
import { createEffect, createSignal, onMount } from "solid-js";
import { Client, Stronghold } from "tauri-plugin-stronghold-api";
import { appDataDir } from "@tauri-apps/api/path";

// Local Imports
import {
  StrongholdCmdOptions,
  StrongholdParseArgs,
  StrongholdProviderProps,
} from "../index.types";
import {
  NOT_INITIALIZED_ERROR,
  NO_STORE_ERROR,
  StrongholdKeys,
} from "../index.config";
import { StrongholdContext } from "./create-context";
import { generalCommands } from "@services/commands";

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
    const vaultFileName = await generalCommands.getEnv({
      name: "VAULT_FILE_NAME",
    });
    const vaultKey = await generalCommands.getEnv({
      name: "VAULT_KEY",
    });
    const vaultClientName = await generalCommands.getEnv({
      name: "VAULT_CLIENT_NAME",
    });

    if (!vaultFileName || !vaultKey || !vaultClientName) return;

    const _stronghold = await Stronghold.load(
      `${await appDataDir()}/${vaultFileName}`,
      vaultKey,
    );

    let _client!: Client;
    try {
      _client = await _stronghold.loadClient(vaultClientName);
    } catch {
      _client = await _stronghold.createClient(vaultClientName);
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

  async function insert(
    key: StrongholdKeys,
    value: string,
    options?: StrongholdCmdOptions,
  ): Promise<void> {
    if (!client()) throw new Error(NOT_INITIALIZED_ERROR);
    const store = client()?.getStore();
    if (!store) throw new Error(NO_STORE_ERROR);
    await store.insert(key, Array.from(new TextEncoder().encode(value)));
    console.info(`Stronghold insert ${key}: `, value);
    if (!options?.save) return;
    await save();
  }

  async function insertWithParse(
    key: StrongholdKeys,
    args: StrongholdParseArgs,
    options?: StrongholdCmdOptions,
  ): Promise<void> {
    const readResponse = await read(key);
    await insert(
      key,
      [
        ...(!readResponse ? [] : readResponse.split(";")),
        `${args.key.toString()}:${args.value.toString()}`,
      ].join(";"),
    );
    if (!options?.save) return;
    await save();
  }

  async function read(key: StrongholdKeys): Promise<string | undefined> {
    if (!client()) throw new Error(NOT_INITIALIZED_ERROR);
    const store = client()?.getStore();
    if (!store) throw new Error(NO_STORE_ERROR);
    const data = await store.get(key);
    if (!data) return;
    const response = new TextDecoder().decode(new Uint8Array(data));
    console.info(`Stronghold read ${key}: `, response);
    return response;
  }

  async function readWithParse(
    key: StrongholdKeys,
    uid: string | number,
  ): Promise<string | undefined> {
    const readResponse = await read(key);
    if (!readResponse) return;
    const parsedReadResponse: string[] = readResponse.split(";");
    const targetReadResponse = parsedReadResponse.find((item) =>
      item.startsWith(`${uid.toString()}:`),
    );
    if (!targetReadResponse) return;
    return targetReadResponse.split(":")[1];
  }

  async function save(): Promise<void> {
    await stronghold()?.save();
  }

  async function remove(
    key: StrongholdKeys,
    options?: StrongholdCmdOptions,
  ): Promise<void> {
    if (!client()) throw new Error(NOT_INITIALIZED_ERROR);
    const store = client()?.getStore();
    if (!store) throw new Error(NO_STORE_ERROR);
    await store.remove(key);
    if (!options?.save) return;
    await save();
  }

  return (
    <StrongholdContext.Provider
      value={{
        insert,
        insertWithParse,
        read,
        readWithParse,
        save,
        remove,
        isInitialized,
      }}
    >
      {props.children}
    </StrongholdContext.Provider>
  );
}
