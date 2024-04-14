// Third Party Imports
import { createEffect, createSignal, on, onMount } from "solid-js";

// Local Imports
import { fileCommands } from "@services/commands";

export function createAwsFileFetcher(filePath?: string) {
  //
  // State
  //

  const [s3File, setS3File] = createSignal<string | undefined>();

  //
  // Lifecycle
  //

  onMount(async () => {
    if (!filePath) return;
    const s3AvatarUrl = await fileCommands.getFile({ filePath });
    setS3File(s3AvatarUrl);
  });

  createEffect(
    on(
      () => filePath,
      async (nextFilePath) => {
        if (!nextFilePath) return;
        const s3AvatarUrl = await fileCommands.getFile({
          filePath: nextFilePath,
        });
        setS3File(s3AvatarUrl);
      },
    ),
  );

  return [s3File];
}
