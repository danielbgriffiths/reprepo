// Third Party Imports
import { useParams } from "@solidjs/router";
import { createMemo, createResource, createSignal } from "solid-js";
import { styled } from "solid-styled-components";

// Local Imports
import { Record } from "@/models";
import { repositoryCommands } from "@services/commands";
import {
  BodyTextVariant,
  Split,
  SplitContent,
  SplitDetails,
  Text,
} from "@services/styles";
import { CommitCalendar } from "./commit-calendar";
import { CommitGradiant } from "./commit-gradient";
import { ContributionCalculationDescription } from "./contribution-calculation-description";
import { ContributionSettings } from "./contribution-settings";
import { YearsColumn } from "./years-column";

interface ContributionHistoryProps {
  records?: Record[];
}

export function ContributionHistory(_props: ContributionHistoryProps) {
  //
  // Hooks
  //

  const params = useParams();

  //
  // State
  //

  const totalCommits = createMemo<number>(() => 0);
  const [selectedDate, setSelectedDate] = createSignal<string | undefined>();
  const [selectedYear, setSelectedYear] = createSignal<number>(
    new Date().getFullYear(),
  );
  const [isShowPrivateEnabled, setIsShowPrivateEnabled] =
    createSignal<boolean>(false);

  const [commitCalendar] = createResource(
    () => params.id,
    async () => {
      return await repositoryCommands.getCommitCalendar({
        targetRepositoryId: Number(params.id),
        year: selectedYear(),
      });
    },
  );

  const [years] = createResource(
    () => params.id,
    async () => {
      return await repositoryCommands.getYearsList({
        targetRepositoryId: Number(params.id),
      });
    },
  );

  //
  // Event Handlers
  //

  function onClickDate(date: string): void {
    setSelectedDate(date);
  }

  function onClickYear(year: number): void {
    if (selectedYear() === year) return;
    setSelectedDate(undefined);
    setSelectedYear(year);
  }

  function onClickShowPrivate(): void {
    setIsShowPrivateEnabled(!isShowPrivateEnabled());
  }

  return (
    <Split>
      <SplitContent size="wide">
        <HistoryHeader>
          <Text variant={BodyTextVariant.CaptionText}>
            {totalCommits()} commits this year
          </Text>
          <ContributionSettings
            isShowPrivateEnabled={isShowPrivateEnabled()}
            onClick={onClickShowPrivate}
          />
        </HistoryHeader>
        <CalendarSection>
          <CalendarContainer>
            <CommitCalendar
              calendar={commitCalendar()}
              selectedDate={selectedDate()}
              onClick={onClickDate}
            />
          </CalendarContainer>
          <CalendarFooter>
            <CalendarFooterLeft>
              <ContributionCalculationDescription />
            </CalendarFooterLeft>
            <CalendarFooterRight>
              <CommitGradiant />
            </CalendarFooterRight>
          </CalendarFooter>
        </CalendarSection>
        <TimelineSection>
          <div />
        </TimelineSection>
      </SplitContent>
      <SplitDetails size="wide">
        <YearsColumn years={years()} onClick={onClickYear} />
      </SplitDetails>
    </Split>
  );
}

const HistoryHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CalendarSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CalendarFooter = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CalendarFooterLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const CalendarFooterRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const TimelineSection = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;
