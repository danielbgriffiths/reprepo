import {
  faCalendar,
  faGrid2Plus,
  faGridHorizontal,
  faNetworkWired,
} from "@fortawesome/pro-light-svg-icons";

export interface NavItem {
  name: string;
  path: string;
  icon: any;
}

export const navItems: NavItem[] = [
  {
    name: "Classical Piano",
    path: `/repositories/1`,
    icon: faGridHorizontal,
  },
  {
    name: "Jazz Piano",
    path: `/repositories/2`,
    icon: faGridHorizontal,
  },
  {
    name: "Ballet",
    path: `/repositories/3`,
    icon: faGridHorizontal,
  },
  { name: "Connect", path: "/add-record", icon: faNetworkWired },
  { name: "Addons", path: "/addons", icon: faGrid2Plus },
  { name: "Calendar", path: "/calendar", icon: faCalendar },
];
