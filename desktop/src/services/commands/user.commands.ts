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

export async function getAuthenticatedUser(
  args: InvokeArgs,
): Promise<AuthenticatedUser | undefined> {
  try {
    const result = await invoke<ApiAuthenticatedUser>(
      Commands.GetAuthenticatedUser,
      args,
    );

    console.info("user.commands: getAuthenticatedUser: ", result);

    return {
      user: {
        id: result.user.id,
        authId: result.user.auth_id,
        firstName: result.user.first_name,
        lastName: result.user.last_name,
        age: result.user.age,
        locale: result.user.locale,
        avatar: result.user.avatar,
        isOnboarded: result.user.is_onboarded,
        createdAt: result.user.created_at,
        updatedAt: result.user.updated_at,
        deletedAt: result.user.deleted_at,
      },
      auth: {
        id: result.auth.id,
        password: result.auth.password,
        email: result.auth.email,
        provider: result.auth.provider,
        createdAt: result.auth.created_at,
        updatedAt: result.auth.updated_at,
        deletedAt: result.auth.deleted_at,
      },
      authAccount: {
        id: result.auth_account.id,
        authId: result.auth_account.auth_id,
        accountId: result.auth_account.account_id,
        refreshToken: result.auth_account.refresh_token,
        accessToken: result.auth_account.access_token,
        isRoot: result.auth_account.is_root,
        createdAt: result.auth_account.created_at,
        updatedAt: result.auth_account.updated_at,
        deletedAt: result.auth_account.deleted_at,
      },
    };
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

    return {
      id: result.id,
      authId: result.auth_id,
      firstName: result.first_name,
      lastName: result.last_name,
      age: result.age,
      locale: result.locale,
      avatar: result.avatar,
      isOnboarded: result.is_onboarded,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      deletedAt: result.deleted_at,
    };
  } catch (e) {
    console.error("user.commands: updateUserOnboarding: ", e);

    return undefined;
  }
}

export async function asyncProcAvatarResize(args: InvokeArgs): Promise<void> {
  try {
    await invoke<void>(Commands.AsyncProcFileResize, args);

    console.info("file.commands: asyncProcAvatarResize: ", "success");
  } catch (e) {
    console.error("file.commands: asyncProcAvatarResize: ", e);
  }
}
