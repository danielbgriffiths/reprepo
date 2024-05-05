// Third Party Imports
import { HoverCard } from "@kobalte/core";
import { styled } from "solid-styled-components";

// Local Imports
import { BodyTextVariant, Text } from "@services/styles";

export function ContributionCalculationDescription() {
  return (
    <HoverCard.Root>
      <HoverCardTrigger>
        <Text variant={BodyTextVariant.Text}>
          Learn how we count contributions
        </Text>
      </HoverCardTrigger>
      <HoverCard.Portal>
        <HoverCardContent>
          <HoverCardArrow />
          <p>Commits are calculated by doing ...</p>
        </HoverCardContent>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

const HoverCardTrigger = styled(HoverCard.Trigger)`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HoverCardContent = styled(HoverCard.Content)``;

const HoverCardArrow = styled(HoverCard.Arrow)``;
