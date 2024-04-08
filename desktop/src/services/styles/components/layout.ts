// Third Party Imports
import { styled } from "solid-styled-components";

export enum PageContainerVariant {
  Default = "default",
  Centered = "centered",
}

interface PageContainerProps {
  variant?: PageContainerVariant;
}

export const PageContainer = styled.div<PageContainerProps>``;
