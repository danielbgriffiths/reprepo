// Third Party Imports
import { children } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";

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
      <div class="primary-container">
        <TopBar />
        <div class="view-container">{c()}</div>
      </div>
      <ToastBar />
    </>
  );
}
