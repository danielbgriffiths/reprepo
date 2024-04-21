// Third Party Imports
import { styled } from "solid-styled-components";
import { createResource, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

// Local Imports
import { recordCommands, repositoryCommands } from "@services/commands";
import { PageContainer } from "@services/styles";
import { RepositoryProfile } from "./repository-profile";
import { RecordsDisplay } from "./records-display";
import { RecordsAnalytics } from "./records-analytics";
import { ContributionHistory } from "./contribution-history";
import { CreateRecordDialog } from "./create-record-dialog";
import { ICreateRecordSchema } from "./create-record-dialog/schema";
import { useAuth } from "@services/auth";
import { ToastKey, useToast } from "@services/toast";

export default function Dashboard() {
  //
  // Hooks
  //

  const params = useParams();
  const auth = useAuth();
  const toast = useToast();

  //
  // State
  //

  const [repository] = createResource(() => params.id, fetchRepository);
  const [records] = createResource(() => params.id, fetchRecords);
  const [isCreateRecordDialogOpen, setIsCreateRecordDialogOpen] =
    createSignal<boolean>(false);
  const [isCreateRecordLoading, setIsCreateRecordLoading] =
    createSignal<boolean>(false);

  //
  // Functions
  //

  async function fetchRepository() {
    return await repositoryCommands.getRepository({
      targetRepositoryId: Number(params.id),
    });
  }

  async function fetchRecords() {
    return await recordCommands.getRecords({
      targetRepositoryId: Number(params.id),
    });
  }

  //
  // Event Handlers
  //

  function onCreateRecord(): void {
    setIsCreateRecordDialogOpen(true);
  }

  async function onCreateRecordSubmit(
    values: ICreateRecordSchema,
  ): Promise<void> {
    setIsCreateRecordLoading(true);

    const record = await recordCommands.createRecord({
      newRecord: {
        repository_id: Number(params.id),
        user_id: auth.store.user!.id,
        name: values.name,
        author: values.author,
        category: values.category,
        authored_at: values.authoredAt,
        started_at: values.startedAt,
      },
    });

    if (!record) {
      toast.register(ToastKey.CreateRecordError, {
        message: `Error creating record for ${auth.store.user!.firstName}`,
      });
      setIsCreateRecordLoading(false);
      return;
    }

    toast.register(ToastKey.CreateRecordSuccess, {
      message: `${auth.store.user!.firstName}, your record has been created!`,
    });
    setIsCreateRecordLoading(false);
    setIsCreateRecordDialogOpen(false);
  }

  return (
    <>
      <PageContainer>
        <Split>
          <RepositoryProfile repository={repository()} />
          <ContentSection>
            <RecordsDisplay
              records={records()}
              onCreateRecord={onCreateRecord}
            />
            <RecordsAnalytics />
            <ContributionHistory />
          </ContentSection>
        </Split>
      </PageContainer>
      <CreateRecordDialog
        isOpen={isCreateRecordDialogOpen()}
        onOpenChange={setIsCreateRecordDialogOpen}
        isLoading={isCreateRecordLoading()}
        onSubmit={onCreateRecordSubmit}
      />
    </>
  );
}

const Split = styled.div``;

const ContentSection = styled.div``;
