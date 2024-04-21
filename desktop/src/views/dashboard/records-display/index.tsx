// Third Party Imports
import { Show } from "solid-js";

// Local Imports
import { Record } from "@/models";
import { BodyTextVariant, Button, Text } from "@services/styles";

interface RecordsTableProps {
  records?: Record[];
  onCreateRecord: () => void;
}

export function RecordsDisplay(props: RecordsTableProps) {
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
      records
    </Show>
  );
}
