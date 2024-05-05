// Third Party Imports
import { createResource, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";
import { Tabs } from "@kobalte/core";

// Local Imports
import { recordCommands, repositoryCommands } from "@services/commands";
import {
  PageContainer,
  Split,
  SplitContent,
  SplitDetails,
} from "@services/styles";
import { RepositoryProfile } from "./repository-profile";
import { FeaturedRecords } from "./featured-records";
import { RepositoryAnalytics } from "./repository-analytics";
import { ContributionHistory } from "./contribution-history";
import { CreateRecordDialog } from "./create-record-dialog";
import { IFinalCreateRecordSchema } from "./create-record-dialog/schema";
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

  const [repository] = createResource(
    () => params.id,
    async () => {
      return await repositoryCommands.getRepository({
        targetRepositoryId: Number(params.id),
      });
    },
  );
  const [records, { refetch }] = createResource(
    () => params.id,
    async () => {
      return await recordCommands.getRecords({
        targetRepositoryId: Number(params.id),
      });
    },
  );
  const [isCreateRecordDialogOpen, setIsCreateRecordDialogOpen] =
    createSignal<boolean>(false);
  const [isCreateRecordLoading, setIsCreateRecordLoading] =
    createSignal<boolean>(false);

  //
  // Event Handlers
  //

  function onCreateRecord(): void {
    setIsCreateRecordDialogOpen(true);
  }

  async function onCreateRecordSubmit(
    values: IFinalCreateRecordSchema,
  ): Promise<void> {
    setIsCreateRecordLoading(true);

    const record = await recordCommands.createRecord({
      newRecord: {
        repositoryId: Number(params.id),
        userId: auth.store.user!.id,
        parentId: undefined,
        ...values,
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

    refetch();
  }

  return (
    <>
      <PageContainer>
        <Split>
          <SplitDetails>
            <RepositoryProfile repository={repository()} />
          </SplitDetails>
          <SplitContent>
            <FeaturedRecords
              records={records() || []}
              onCreateRecord={onCreateRecord}
            />
            <Tabs.Root defaultValue="history">
              <Tabs.List>
                <Tabs.Trigger value="history">History</Tabs.Trigger>
                <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
                <Tabs.Indicator />
              </Tabs.List>
              <Tabs.Content value="history">
                <ContributionHistory />
              </Tabs.Content>
              <Tabs.Content value="analytics">
                <RepositoryAnalytics />
              </Tabs.Content>
            </Tabs.Root>
          </SplitContent>
        </Split>
      </PageContainer>
      <CreateRecordDialog
        repository={repository()!}
        isOpen={isCreateRecordDialogOpen()}
        onOpenChange={setIsCreateRecordDialogOpen}
        isLoading={isCreateRecordLoading()}
        onSubmit={onCreateRecordSubmit}
      />
    </>
  );
}
