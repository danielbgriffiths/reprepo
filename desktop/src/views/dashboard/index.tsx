// Third Party Imports
import { createResource, createSignal } from "solid-js";
import { useParams } from "@solidjs/router";

// Local Imports
import { recordCommands, repositoryCommands } from "@services/commands";
import {
  PageContainer,
  Split,
  SplitContent,
  SplitDetails,
} from "@services/styles";
import { RepositoryProfile } from "./repository-profile";
import { RecordsDisplay } from "./records-display";
import { RecordsAnalytics } from "./records-analytics";
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
        repository_id: Number(params.id),
        user_id: auth.store.user!.id,
        parent_id: undefined,
        composition_meta: {
          genre: values.compositionMeta.genre,
          written_at: values.compositionMeta.writtenAt,
          full_title: values.compositionMeta.fullTitle,
          piece_title: values.compositionMeta.pieceTitle,
          set_title: values.compositionMeta.setTitle,
          number_in_set: values.compositionMeta.numberInSet,
          movement: values.compositionMeta.movement,
          opus: values.compositionMeta.opus,
          kvv: values.compositionMeta.kvv,
          n: values.compositionMeta.n,
          variation: values.compositionMeta.variation,
          key: values.compositionMeta.key,
          work_summary: values.compositionMeta.workSummary,
        },
        author_meta: {
          full_name: values.authorMeta.fullName,
          first_name: values.authorMeta.firstName,
          last_name: values.authorMeta.lastName,
          middle: values.authorMeta.middle,
          born_at: values.authorMeta.bornAt,
          died_at: values.authorMeta.diedAt,
          birth_city: values.authorMeta.birthCity,
          birth_region: values.authorMeta.birthRegion,
          birth_country: values.authorMeta.birthCountry,
          nationality: values.authorMeta.nationality,
          gender: values.authorMeta.gender,
          author_summary: values.authorMeta.authorSummary,
        },
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
            <RecordsDisplay
              records={records()}
              onCreateRecord={onCreateRecord}
            />
            <RecordsAnalytics />
            <ContributionHistory />
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
