// Third Party Imports
import {
  createEffect,
  createSignal,
  JSXElement,
  on,
  onMount,
  children,
  Accessor,
} from "solid-js";

// Local Imports
import { fileCommands } from "@services/commands";

interface S3ImageProps {
  filePath?: string;
  children: (props: { file: Accessor<string | undefined> }) => JSXElement;
}

export function S3Image(props: S3ImageProps) {
  //
  // State
  //

  const [s3File, setS3File] = createSignal<string | undefined>();

  const c = children(() => props.children({ file: s3File }));

  //
  // Lifecycle
  //

  onMount(async () => {
    await getFile(props.filePath);
  });

  createEffect(
    on(
      () => props.filePath,
      async (nextFilePath) => {
        await getFile(nextFilePath);
      },
    ),
  );

  //
  // Functions
  //

  async function getFile(targetFilePath?: string): Promise<void> {
    if (!targetFilePath) return;

    const u8vec = await fileCommands.getFile({
      filePath: targetFilePath,
    });

    if (!u8vec) return;

    const reader = new FileReader();
    reader.onload = function () {
      setS3File(reader.result as string);
    };
    reader.readAsDataURL(new Blob([new Uint8Array(u8vec).buffer]));
  }

  return c();
}
