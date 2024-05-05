// Third Party Imports
import { BodyTextVariant, Text } from "@services/styles";
import { styled } from "solid-styled-components";

// Local Imports
import { CommitBlock } from "../commit-block";

export function CommitGradiant() {
  return (
    <GradientContainer>
      <Text variant={BodyTextVariant.OverlineText}>Less</Text>
      <CommitBlock density={0} />
      <CommitBlock density={1} />
      <CommitBlock density={2} />
      <CommitBlock density={3} />
      <CommitBlock density={4} />
      <CommitBlock density={5} />
      <Text variant={BodyTextVariant.OverlineText}>More</Text>
    </GradientContainer>
  );
}

const GradientContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
