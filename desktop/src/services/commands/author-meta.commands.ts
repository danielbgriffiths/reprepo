// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import { ApiAuthorMetaFilterItem } from "@/models";
import { ComboboxOption } from "@components/form/components/combobox-field";

interface GetAuthorsPayload extends InvokeArgs {
  field: string;
  specialization: string;
}

export async function getAuthors(
  args: GetAuthorsPayload,
): Promise<ComboboxOption[] | undefined> {
  try {
    const result = await invoke<ApiAuthorMetaFilterItem[]>(
      Commands.GetAuthors,
      args,
    );

    console.info("author-meta.commands: getAuthors: ", result);

    return result.map((item) => ({
      value: item.id,
      label: item.full_name,
    }));
  } catch (e) {
    console.error("author-meta.commands: getAuthors: ", e);

    return undefined;
  }
}
