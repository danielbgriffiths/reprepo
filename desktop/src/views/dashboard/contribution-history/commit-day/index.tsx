// Third Party Imports
import { Tooltip } from "@kobalte/core";
import { styled } from "solid-styled-components";

// Local Imports
import { CommitBlock } from "../commit-block";
import { CommitCalendarDay } from "@/models";
import { BodyTextVariant, Text } from "@services/styles";

interface Props {
  commitCalendarDay: CommitCalendarDay;
  onClick: (date: string) => void;
}

export function CommitDay(props: Props) {
  return (
    <Tooltip.Root>
      <TooltipTrigger
        onClick={() => props.onClick(props.commitCalendarDay.date)}
      >
        <CommitBlock density={props.commitCalendarDay.density} />
      </TooltipTrigger>
      <Tooltip.Portal>
        <TooltipContent>
          <TooltipArrow />
          <Text variant={BodyTextVariant.ExpressiveText}>
            {props.commitCalendarDay.count} contributions on{" "}
            {props.commitCalendarDay.date}.
          </Text>
        </TooltipContent>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

const TooltipTrigger = styled(Tooltip.Trigger)`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 12px;
  height: 12px;
  padding: 0;
  border: none;
  background-color: transparent;
  margin: 0;
`;

const TooltipContent = styled(Tooltip.Content)``;

const TooltipArrow = styled(Tooltip.Arrow)``;
