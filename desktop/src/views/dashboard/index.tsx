// Third Party Imports
import { styled } from "solid-styled-components";
import { createResource } from "solid-js";

// Local Imports
import { Header } from "./header";
import { DecisionAnalytics } from "./decision-analytics";
import { RecordsTable } from "./records-table";
import { useAuth } from "@services/auth";
import { repositoryCommands, recordCommands } from "@services/commands";
import { Repository, Record } from "@/models";
import { PageContainer } from "@services/styles";

export default function Dashboard() {
  //
  // Hooks
  //

  const auth = useAuth();

  //
  // State
  //

  const [repository] = createResource<Repository | undefined>(async () => {
    return await repositoryCommands.getRepository({
      repositoryId: auth.store.activeRepositoryId,
    });
  });

  const [records] = createResource<Record[] | undefined>(async () => {
    return await recordCommands.getRecords({
      repositoryId: auth.store.activeRepositoryId,
    });
  });

  return (
    <PageContainer>
      <Header repository={repository()} records={records()} />
      <Styled.DashboardBodySection>
        <DecisionAnalytics records={records()} />
        <RecordsTable records={records()} />
      </Styled.DashboardBodySection>
    </PageContainer>
  );
}

export const Styled = {
  DashboardBodySection: styled.div``,
};
