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
    await getFile(filePath);
  });

  createEffect(
    on(
      () => filePath,
      async (nextFilePath) => {
        await getFile(nextFilePath);
      },
    ),
  );

  //
  // Functions
  //

  async function getFile(targetFilePath?: string): Promise<void> {
    console.log("targetFilePath", targetFilePath);
    if (!filePath) return;
    const s3AvatarUrl = await fileCommands.getFile({
      filePath: targetFilePath,
    });
    console.log("s3AvatarUrl", s3AvatarUrl);
    setS3File(s3AvatarUrl);
  }

  return [s3File];
}
