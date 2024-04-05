// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import { ApiRepository, Repository } from "@/models";

export async function createRepository(
  args: InvokeArgs,
): Promise<number | undefined> {
  try {
    const result = await invoke<number>(Commands.CreateRepository, args);

    console.info("repository.commands: createRepository: ", result);

    return result;
  } catch (e) {
    console.error("repository.commands: createRepository: ", e);

    return undefined;
  }
}

export async function getRepositories(
  args: InvokeArgs,
): Promise<Repository[] | undefined> {
  try {
    const result = await invoke<ApiRepository[]>(
      Commands.GetRepositories,
      args,
    );

    console.info("repository.commands: getRepositories: ", result);

    return result.map(
      (repository): Repository => ({
        id: repository.id,
        name: repository.name,
        userId: repository.user_id,
        field: repository.field,
        specialization: repository.specialization,
        isPrivate: repository.is_private,
        avatar: repository.avatar,
        startDate: repository.start_date,
        createdAt: repository.created_at,
        updatedAt: repository.updated_at,
        deletedAt: repository.deleted_at,
      }),
    );
  } catch (e) {
    console.error("repository.commands: getRepositories: ", e);

    return undefined;
  }
}

export async function getRepository(
  args: InvokeArgs,
): Promise<Repository | undefined> {
  try {
    const result = await invoke<ApiRepository>(Commands.GetRepository, args);

    console.info("repository.commands: getRepositories: ", result);

    return {
      id: result.id,
      name: result.name,
      userId: result.user_id,
      field: result.field,
      specialization: result.specialization,
      isPrivate: result.is_private,
      avatar: result.avatar,
      startDate: result.start_date,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
      deletedAt: result.deleted_at,
    };
  } catch (e) {
    console.error("repository.commands: getRepositories: ", e);

    return undefined;
  }
}
