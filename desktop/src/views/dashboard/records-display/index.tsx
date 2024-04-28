// Third Party Imports
import { For, Show } from "solid-js";
import { styled } from "solid-styled-components";
import Icon from "solid-fa";
import { faPlus } from "@fortawesome/pro-light-svg-icons";

// Local Imports
import { Record } from "@/models";
import {
  BodyTextVariant,
  Button,
  HeadingTextVariant,
  Text,
  Title,
} from "@services/styles";
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
    <Container>
      <TopBar>
        <Title variant={HeadingTextVariant.ExpressiveSubTitle}>Records</Title>
        <Button onClick={props.onCreateRecord}>
          <Text variant={BodyTextVariant.ButtonText}>
            <Icon icon={faPlus} />
          </Text>
        </Button>
      </TopBar>
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
              <Text variant={BodyTextVariant.OverlineText}>Example</Text>
            </a>
          )}
        </For>
      </Show>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`;

const TopBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
