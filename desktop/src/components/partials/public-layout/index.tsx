// Third Party Imports
import { children, JSXElement } from "solid-js";

// Local Imports
import * as Styled from "./index.styled";

export interface PublicLayoutProps {
  children: JSXElement;
}

export function PublicLayout(props: PublicLayoutProps) {
  //
  // State
  //

  const c = children(() => props.children);

  return <Styled.Wrapper>{c()}</Styled.Wrapper>;
}
