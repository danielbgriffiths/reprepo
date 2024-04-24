import {
  faCalendar,
  faGrid2Plus,
  faNetworkWired,
} from "@fortawesome/pro-light-svg-icons";

export interface NavItem {
  name: string;
  path: string;
  icon: any;
}

export const navItems: NavItem[] = [
  { name: "Connect", path: "/add-record", icon: faNetworkWired },
  { name: "Addons", path: "/addons", icon: faGrid2Plus },
  { name: "Calendar", path: "/calendar", icon: faCalendar },
];
