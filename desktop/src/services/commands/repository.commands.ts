// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import { ApiRepository, CommitCalendarTable, Repository } from "@/models";
import { toCamel, toSnake } from "@/utils";

interface GetRepositoryPayload extends InvokeArgs {
  targetRepositoryId: number;
}

interface GetYearsListPayload extends InvokeArgs {
  targetRepositoryId: number;
}

interface GetCommitCalendarPayload extends InvokeArgs {
  targetRepositoryId: number;
  year: number;
}

export async function createRepository(
  args: InvokeArgs,
): Promise<number | undefined> {
  try {
    args = toSnake(args);

    console.log("repository.commands: createRepository: args: ", args);

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

    return toCamel<Repository[]>(result);
  } catch (e) {
    console.error("repository.commands: getRepositories: ", e);

    return undefined;
  }
}

export async function getRepository(
  args: GetRepositoryPayload,
): Promise<Repository | undefined> {
  try {
    const result = await invoke<ApiRepository>(Commands.GetRepository, args);

    console.info("repository.commands: getRepositories: ", result);

    return toCamel<Repository>(result);
  } catch (e) {
    console.error("repository.commands: getRepositories: ", e);

    return undefined;
  }
}

export async function getCommitCalendar(
  args: GetCommitCalendarPayload,
): Promise<CommitCalendarTable | undefined> {
  try {
    const result = await invoke<CommitCalendarTable>(
      Commands.GetCommitCalendar,
      args,
    );

    console.info("repository.commands: getCommitCalendar: ", result);

    return result;
  } catch (e) {
    console.error("repository.commands: getCommitCalendar: ", e);

    return undefined;
  }
}

export async function getYearsList(
  args: GetYearsListPayload,
): Promise<number[] | undefined> {
  try {
    const result = await invoke<number[]>(Commands.GetYearsList, args);

    console.info("repository.commands: getYearsList: ", result);

    return result;
  } catch (e) {
    console.error("repository.commands: getYearsList: ", e);

    return undefined;
  }
}
