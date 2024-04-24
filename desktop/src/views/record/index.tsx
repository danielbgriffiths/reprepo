// Third Party Imports
import { styled } from "solid-styled-components";
import { useParams } from "@solidjs/router";
import { createResource, createSignal, For } from "solid-js";

// Local Imports
import { HeadingTextVariant, PageContainer, Title } from "@services/styles";
import { recordCommands, commitCommands } from "@services/commands";
import { CreateCommitDialog } from "@views/record/create-commit-dialog";
import { ToastKey, useToast } from "@services/toast";
import { useAuth } from "@services/auth";
import { ICreateCommitSchema } from "@views/record/create-commit-dialog/schema";

export default function Record() {
  //
  // Hooks
  //

  const params = useParams();
  const auth = useAuth();
  const toast = useToast();

  //
  // State
  //

  const [record] = createResource(
    () => params.id || params.recordId,
    fetchRecord,
  );
  const [commits, { refetch }] = createResource(() => params.id, fetchCommits);
  const [isCreateCommitDialogOpen, setIsCreateCommitDialogOpen] =
    createSignal<boolean>(false);
  const [isCreateCommitLoading, setIsCreateCommitLoading] =
    createSignal<boolean>(false);

  //
  // Functions
  //

  async function fetchRecord() {
    return await recordCommands.getRecordById({
      targetRecordId: Number(params.recordId),
    });
  }

  async function fetchCommits() {
    return await commitCommands.getCommits({
      targetRecordId: Number(params.recordId),
    });
  }

  //
  // Event Handlers
  //

  function onCreateCommit(): void {
    setIsCreateCommitDialogOpen(true);
  }

  async function onCreateCommitSubmit(
    values: ICreateCommitSchema,
  ): Promise<void> {
    setIsCreateCommitLoading(true);

    const commit = await commitCommands.createCommit({
      newCommit: {
        record_id: Number(params.recordId),
        title: values.title,
        notes: values.notes,
      },
    });

    if (!commit) {
      toast.register(ToastKey.CreateCommitError, {
        message: `Error creating commit for ${auth.store.user!.firstName}`,
      });
      setIsCreateCommitLoading(false);
      return;
    }

    toast.register(ToastKey.CreateCommitSuccess, {
      message: `${auth.store.user!.firstName}, your commit has been created!`,
    });
    setIsCreateCommitLoading(false);
    setIsCreateCommitDialogOpen(false);

    refetch();
  }

  return (
    <>
      <PageContainer>
        <Split direction="left">
          <SplitContent>
            <Title variant={HeadingTextVariant.Title}>{record()?.name}</Title>
            <button onClick={onCreateCommit}>New Commit</button>
            <For each={commits() ?? []}>
              {(commit) => <div>{commit.notes}</div>}
            </For>
          </SplitContent>
          <SplitDetails />
        </Split>
      </PageContainer>
      <CreateCommitDialog
        isOpen={isCreateCommitDialogOpen()}
        onOpenChange={setIsCreateCommitDialogOpen}
        isLoading={isCreateCommitLoading()}
        onSubmit={onCreateCommitSubmit}
      />
    </>
  );
}

const Split = styled.div<{ direction: "left" | "right" }>`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: ${({ direction }) =>
    direction === "left" ? "wrap" : "wrap-reverse"};
`;

const SplitContent = styled.div`
  width: 70%;
`;

const SplitDetails = styled.div`
  width: 30%;
`;
