import { JSXElement } from "solid-js";

export interface SideBarDisplayProps {
  children: JSXElement;
}

export function SideBarDisplay(props: SideBarDisplayProps) {
  return (
    <div class="drawer drawer-open">
      <input id="side-bar-toggle" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col items-center justify-center">
        <label
          htmlFor="side-bar-toggle"
          class="btn btn-primary drawer-button lg:hidden"
        >
          Open drawer
        </label>
      </div>
      <div class="drawer-side">
        <label
          htmlFor="side-bar-toggle"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {props.children}
        </ul>
      </div>
    </div>
  );
}
