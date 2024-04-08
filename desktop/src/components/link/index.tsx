// Third Party Imports
import { Link as KobalteLink } from "@kobalte/core";
import { JSXElement } from "solid-js";

export interface LinkProps {
  href: string;
  children: JSXElement;
}

export function Link(props: LinkProps) {
  return (
    <KobalteLink.Root href={props.href}>{props.children}</KobalteLink.Root>
  );
}
