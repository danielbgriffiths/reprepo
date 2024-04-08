// Third Party Imports
import { Show } from "solid-js";
import Icon from "solid-fa";
import { faPlus } from "@fortawesome/pro-light-svg-icons";

// Local Imports
import { Record } from "@/models";
import { styled } from "solid-styled-components";

interface RecordsTableProps {
  records?: Record[];
}

export function RecordsTable(props: RecordsTableProps) {
  //
  // Event Handlers
  //

  function onClickCreateRecord(_event: MouseEvent): void {
    // TODO: Implement onClickCreateRecord
  }

  return (
    <Show
      when={!!props.records!.length}
      fallback={
        <Styled.NoRecordsOverlay>
          <Styled.CreateRecordButton
            type="button"
            onClick={onClickCreateRecord}
          >
            <Icon icon={faPlus} />
            <Styled.CreateRecordText>
              Create Entry Record
            </Styled.CreateRecordText>
          </Styled.CreateRecordButton>
        </Styled.NoRecordsOverlay>
      }
    >
      <Styled.Table>
        <thead>
          <Styled.TableHeadRow>
            <Styled.TableHeadCell>Name</Styled.TableHeadCell>
            <Styled.TableHeadCell>Author</Styled.TableHeadCell>
            <Styled.TableHeadCell>Category</Styled.TableHeadCell>
          </Styled.TableHeadRow>
        </thead>
        <tbody>
          {(props.records || []).map((record) => (
            <Styled.TableBodyRow>
              <Styled.TableBodyCell>{record.name}</Styled.TableBodyCell>
              <Styled.TableBodyCell>{record.author}</Styled.TableBodyCell>
              <Styled.TableBodyCell>{record.category}</Styled.TableBodyCell>
            </Styled.TableBodyRow>
          ))}
        </tbody>
      </Styled.Table>
    </Show>
  );
}

const Styled = {
  Table: styled.table``,
  TableHeadRow: styled.thead``,
  TableBodyRow: styled.tr``,
  TableBodyCell: styled.td``,
  TableHeadCell: styled.th``,
  NoRecordsOverlay: styled.div``,
  CreateRecordButton: styled.button``,
  CreateRecordText: styled.span``,
};
