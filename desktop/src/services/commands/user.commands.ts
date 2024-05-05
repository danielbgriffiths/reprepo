// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import {
  ApiAuthenticatedUser,
  ApiUser,
  AuthenticatedUser,
  User,
} from "@/models";
import { Commands } from "@services/commands/index.types";
import { toCamel } from "@/utils";

export async function getAuthenticatedUser(
  args: InvokeArgs,
): Promise<AuthenticatedUser | undefined> {
  try {
    const result = await invoke<ApiAuthenticatedUser>(
      Commands.GetAuthenticatedUser,
      args,
    );

    console.info("user.commands: getAuthenticatedUser: ", result);

    return toCamel<AuthenticatedUser>(result);
  } catch (e) {
    console.error("user.commands: getAuthenticatedUser: ", e);

    return undefined;
  }
}

export async function getUsers(args: InvokeArgs): Promise<User[] | undefined> {
  try {
    const result = await invoke<User[]>(Commands.GetUsers, args);

    console.info("user.commands: getUsers: ", result);

    return result;
  } catch (e) {
    console.error("user.commands: getUsers: ", e);

    return undefined;
  }
}

export async function updateUserOnboarding(
  args: InvokeArgs,
): Promise<User | undefined> {
  try {
    const result = await invoke<ApiUser>(Commands.UpdateUserOnboarding, args);

    console.info("user.commands: updateUserOnboarding: ", result);

    return toCamel<User>(result);
  } catch (e) {
    console.error("user.commands: updateUserOnboarding: ", e);

    return undefined;
  }
}

export async function asyncProcAvatarResize(args: InvokeArgs): Promise<void> {
  try {
    await invoke<void>(Commands.AsyncProcAvatarResize, args);

    console.info("file.commands: asyncProcAvatarResize: ", "success");
  } catch (e) {
    console.error("file.commands: asyncProcAvatarResize: ", e);
  }
}
