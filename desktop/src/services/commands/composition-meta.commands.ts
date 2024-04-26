// Third Party Imports
import { invoke } from "@tauri-apps/api";
import { InvokeArgs } from "@tauri-apps/api/tauri";

// Local Imports
import { Commands } from "@services/commands/index.types";
import { ApiCompositionMetaFilterItem } from "@/models";
import { ComboboxOption } from "@components/form/components/combobox-field";

interface GetNamesPayload extends InvokeArgs {
  field: string;
  specialization: string;
  authorMetaIds: number[];
}

export async function getNames(
  args: GetNamesPayload,
): Promise<ComboboxOption[] | undefined> {
  try {
    const result = await invoke<ApiCompositionMetaFilterItem[]>(
      Commands.GetNames,
      args,
    );

    console.info("composition-meta.commands: getNames: ", result);

    return result.map((item) => ({
      value: item.id,
      label: item.full_title,
    }));
  } catch (e) {
    console.error("composition-meta.commands: getNames: ", e);

    return undefined;
  }
}
