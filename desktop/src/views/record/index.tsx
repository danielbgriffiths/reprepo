// Third Party Imports
import { styled } from "solid-styled-components";
import { useParams } from "@solidjs/router";
import { createResource } from "solid-js";

// Local Imports
import { HeadingTextVariant, PageContainer, Title } from "@services/styles";
import { recordCommands } from "@services/commands";

export default function Record() {
  //
  // Hooks
  //

  const params = useParams();

  //
  // State
  //

  const [record] = createResource(
    () => params.id || params.recordId,
    fetchRecord,
  );

  //
  // Functions
  //

  async function fetchRecord() {
    return await recordCommands.getRecordById({
      targetRecordId: Number(params.recordId),
    });
  }

  return (
    <PageContainer>
      <Split direction="left">
        <SplitContent>
          <Title variant={HeadingTextVariant.Title}>{record()?.name}</Title>
        </SplitContent>
        <SplitDetails />
      </Split>
    </PageContainer>
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
