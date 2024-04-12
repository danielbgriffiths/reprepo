// Third Party Imports
import { styled } from "solid-styled-components";

export enum PageContainerVariant {
  Default = "default",
  Centered = "centered",
}

interface PageContainerProps {
  variant?: PageContainerVariant;
}

export const PageContainer = styled.div<PageContainerProps>`
  padding: 1rem;

  ${(props) => {
    switch (props.variant) {
      case PageContainerVariant.Centered:
        return `
            display: flex;
            justify-content: center;
            align-items: flex-start;
            height: 100%;
            width: 100%;
          `;
      default:
        return "";
    }
  }}
`;
