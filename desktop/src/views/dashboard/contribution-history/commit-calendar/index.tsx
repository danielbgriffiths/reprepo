// Third Party Imports
import { For, Show } from "solid-js";
import { styled } from "solid-styled-components";

// Local Imports
import { CommitDay } from "../commit-day";
import { CommitCalendarTable } from "@/models";
import { BodyTextVariant, Text } from "@services/styles";

interface Props {
  calendar?: CommitCalendarTable;
  selectedDate?: string;
  onClick: (date: string) => void;
}

export function CommitCalendar(props: Props) {
  //
  // Functions
  //

  function getMonthLabelByIndex(index: number) {
    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][index];
  }

  function getDayLabelByIndex(index: number) {
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index];
  }

  return (
    <Table>
      <thead>
        <HeaderRow>
          <GhostHeaderCell />
          <For each={props.calendar?.headers}>
            {(header, headerIdx) => (
              <HeaderCell colSpan={header.count}>
                <Text variant={BodyTextVariant.OverlineText}>
                  {getMonthLabelByIndex(headerIdx())}
                </Text>
              </HeaderCell>
            )}
          </For>
        </HeaderRow>
      </thead>
      <tbody>
        <For each={props.calendar?.rows}>
          {(row, rowIdx) => (
            <Row>
              <Show when={rowIdx() % 2 !== 0} fallback={<GhostLabelCell />}>
                <LabelCell>
                  <Text variant={BodyTextVariant.OverlineText}>
                    {getDayLabelByIndex(rowIdx())}
                  </Text>
                </LabelCell>
              </Show>
              <For each={row.days}>
                {(day) => (
                  <Cell colSpan={1}>
                    <CommitDay
                      commitCalendarDay={day}
                      onClick={props.onClick}
                    />
                  </Cell>
                )}
              </For>
            </Row>
          )}
        </For>
      </tbody>
    </Table>
  );
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const HeaderRow = styled.tr``;

const GhostHeaderCell = styled.th``;

const HeaderCell = styled.th``;

const Row = styled.tr`
  height: 12px;
  padding: 0;
`;

const GhostLabelCell = styled.td`
  height: 12px;
`;

const LabelCell = styled.td`
  height: 12px;
`;

const Cell = styled.td`
  width: 12px;
  height: 12px;
  padding: 0;
`;
