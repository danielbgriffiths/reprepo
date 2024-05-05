// Third Party Imports
import { For } from "solid-js";
import { styled } from "solid-styled-components";

// Local Imports
import { BodyTextVariant, Button, Text } from "@services/styles";

interface Props {
  years?: number[];
  onClick: (year: number) => void;
}

export function YearsColumn(props: Props) {
  return (
    <YearList>
      <For each={props.years}>
        {(year) => (
          <YearItem>
            <Button type="button" onClick={() => props.onClick(year)}>
              <Text variant={BodyTextVariant.ButtonText}>{year}</Text>
            </Button>
          </YearItem>
        )}
      </For>
    </YearList>
  );
}

const YearList = styled.ul``;

const YearItem = styled.li``;
