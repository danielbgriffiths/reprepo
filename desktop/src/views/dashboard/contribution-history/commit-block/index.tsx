// Third Party Imports
import { styled } from "solid-styled-components";

import { hexToRGB } from "@services/styles";

interface Props {
  density: number;
}

export function CommitBlock(props: Props) {
  return <CommitBlockElement density={props.density} />;
}

const CommitBlockElement = styled.div<{ density: number }>`
  background-color: ${({ theme, density }) => {
    const { r, g, b } = hexToRGB(theme?.colors?.state.success!);
    return `rgba(${r} ${g} ${b} / ${density / 5})`;
  }};
  border-radius: ${({ theme }) => theme?.radius.badge ?? 0};
  height: 12px;
  width: 12px;
  border: solid 1px grey;
`;
