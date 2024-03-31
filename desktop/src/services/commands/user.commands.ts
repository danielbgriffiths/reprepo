// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { AuthenticatedUser, User } from "@/models";
import { Commands } from "@services/commands/index.types";

export async function getAuthenticatedUser(
  args: InvokeArgs,
): Promise<AuthenticatedUser | undefined> {
  try {
    const result = await invoke<AuthenticatedUser>(
      Commands.GetAuthenticatedUser,
      args,
    );

    console.info("getAuthenticatedUser: ", result);

    return result;
  } catch (e) {
    console.error("getAuthenticatedUser: ", e);

    return undefined;
  }
}

export async function getUsers(args: InvokeArgs): Promise<User[] | undefined> {
  try {
    const result = await invoke<User[]>(Commands.GetUsers, args);

    console.info("getUsers: ", result);

    return result;
  } catch (e) {
    console.error("getUsers: ", e);

    return undefined;
  }
}

export async function updateUserOnboarding(
  args: InvokeArgs,
): Promise<User | undefined> {
  try {
    const result = await invoke<User>(Commands.UpdateUserOnboarding, args);

    console.info("updateUserOnboarding: ", result);

    return result;
  } catch (e) {
    console.error("updateUserOnboarding: ", e);

    return undefined;
  }
}
