// Third Party Imports
import { children } from "solid-js";
import { RouteSectionProps } from "@solidjs/router";

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

  return <main>{c()}</main>;
}
