// Third Party Imports
import { children } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";

// Local Imports
import { SideBar } from "@components/partials/side-bar";
import { TopBar } from "@components/partials/top-bar";
import { ToastBar } from "@components/shared/toast-bar";

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
    <>
      <SideBar />
      <div class="page-container">
        <TopBar />
        <div class="page-content">{c()}</div>
      </div>
      <ToastBar />
    </>
  );
}
