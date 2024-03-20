// Third Party Imports
import { children } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";

// Local Imports
import { SideBar } from "@components/partials/side-bar";
import { ToastBar } from "@components/shared/toast-bar";
import * as Styled from "./index.styled";

export interface ViewsProps extends RouteSectionProps {}

/**
 * The main view component that wraps the entire application
 * @param {ViewsProps} props
 */
export default function Views(props: ViewsProps) {
  //
  // State
  //

  const c = children(() => props.children);

  return (
    <Styled.ApplicationWrapper>
      <SideBar />
      {c()}
      <ToastBar />
    </Styled.ApplicationWrapper>
  );
}
