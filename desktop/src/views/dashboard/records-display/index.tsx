// Third Party Imports
import { For, Show } from "solid-js";

// Local Imports
import { Record } from "@/models";
import { BodyTextVariant, Button, Text } from "@services/styles";
import { useParams } from "@solidjs/router";

interface RecordsTableProps {
  records?: Record[];
  onCreateRecord: () => void;
}

export function RecordsDisplay(props: RecordsTableProps) {
  //
  // Hooks
  //

  const params = useParams();

  return (
    <Show
      when={!!props.records?.length}
      fallback={
        <Button onClick={props.onCreateRecord}>
          <Text variant={BodyTextVariant.ButtonText}>
            Start Creating Records
          </Text>
        </Button>
      }
    >
      <For each={props.records || []}>
        {(record) => (
          <a href={`/auth/repositories/${params.id}/records/${record.id}`}>
            <Text variant={BodyTextVariant.OverlineText}>{record.name}</Text>
          </a>
        )}
      </For>
    </Show>
  );
}
