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

export const Split = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const SplitDetails = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem;
`;

export const SplitContent = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 1rem;
`;
