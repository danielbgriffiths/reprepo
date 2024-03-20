import { invoke } from "@tauri-apps/api";

import { Commands, InvokeResult } from "@services/commands/index.types";
import { InvokeArgs } from "@tauri-apps/api/tauri";

export async function cmd<T>(
  command: Commands,
  args?: InvokeArgs,
): Promise<InvokeResult<T>> {
  const result = await invoke<InvokeResult<T>>(command, args);
  console.info(`invoke ${command}: `, result);
  return result;
}
