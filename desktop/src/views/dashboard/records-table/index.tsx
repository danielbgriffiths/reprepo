// Local Imports
import { Record } from "@/models";

interface RecordsTableProps {
  records?: Record[];
}

export function RecordsTable(props: RecordsTableProps) {
  return (
    <table>
      <thead>
        <tr>
          <th>Record ID</th>
        </tr>
      </thead>
      <tbody>
        {(props.records || []).map((record) => (
          <tr>
            <td>{record.id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
