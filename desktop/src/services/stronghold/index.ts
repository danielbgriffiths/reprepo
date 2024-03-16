// Third Party Imports
import { Stronghold, Client } from "tauri-plugin-stronghold-api";
import { appDataDir } from "@tauri-apps/api/path";

// Local Imports
import { StrongholdService } from "./index.types.ts";

/**
 * Create a Stronghold service
 * Exposes the Stronghold API to the application
 */
export async function createStrongholdService(): Promise<StrongholdService> {
  if (
    !process.env.VAULT_FILE_NAME ||
    !process.env.VAULT_KEY ||
    !process.env.VAULT_CLIENT_NAME
  ) {
    throw new Error("Missing environment variables");
  }

  const stronghold = await Stronghold.load(
    `${await appDataDir()}/${process.env.VAULT_FILE_NAME}`,
    process.env.VAULT_KEY,
  );

  let client: Client;

  try {
    client = await stronghold.loadClient(process.env.VAULT_CLIENT_NAME);
  } catch {
    client = await stronghold.createClient(process.env.VAULT_CLIENT_NAME);
  }

  async function insert(key: string, value: string): Promise<void> {
    const store = client.getStore();
    return await store.insert(key, Array.from(new TextEncoder().encode(value)));
  }

  async function read(key: string): Promise<string | undefined> {
    const store = client.getStore();
    const data = await store.get(key);
    if (!data) return;
    return new TextDecoder().decode(new Uint8Array(data));
  }

  async function save(): Promise<void> {
    await stronghold.save();
  }

  async function remove(key: string): Promise<void> {
    const store = client.getStore();
    await store.remove(key);
  }

  return {
    insert,
    read,
    save,
    remove,
  };
}
