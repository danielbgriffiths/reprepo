// Third Party Imports
import { children } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";
import { styled } from "solid-styled-components";

// Local Imports
import { SideBar } from "@components/side-bar";
import { TopBar } from "@components/top-bar";
import { ToastBar } from "@components/toast-bar";

export interface ViewsProps extends RouteSectionProps {}

export default function Views(props: ViewsProps) {
  //
  // State
  //

  const c = children(() => props.children);

  return (
    <>
      <SideBar />
      <Styled.Container>
        <TopBar />
        <Styled.Content>{c()}</Styled.Content>
      </Styled.Container>
      <ToastBar />
    </>
  );
}

const Styled = {
  Container: styled.div``,
  Content: styled.div``,
};
