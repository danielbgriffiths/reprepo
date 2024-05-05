// Third Party Imports
import { For, Show } from "solid-js";
import { styled } from "solid-styled-components";

// Local Imports
import { CommitDay } from "../commit-day";
import { CommitCalendarTable } from "@/models";

interface Props {
  calendar?: CommitCalendarTable;
  selectedDate?: string;
  onClick: (date: string) => void;
}

export function CommitCalendar(props: Props) {
  //
  // Functions
  //

  function getMonthLabelByIndex(_index: number) {
    return "";
  }

  function getDayLabelByIndex(_index: number) {
    return "";
  }

  return (
    <Table>
      <thead>
        <HeaderRow>
          <GhostHeaderCell />
          <For each={props.calendar?.headers}>
            {(header, headerIdx) => (
              <HeaderCell colSpan={header.count}>
                {getMonthLabelByIndex(headerIdx())}
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
                <LabelCell>{getDayLabelByIndex(rowIdx())}</LabelCell>
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
`;

const HeaderRow = styled.tr``;

const GhostHeaderCell = styled.th``;

const HeaderCell = styled.th``;

const Row = styled.tr``;

const GhostLabelCell = styled.td``;

const LabelCell = styled.td``;

const Cell = styled.td``;
