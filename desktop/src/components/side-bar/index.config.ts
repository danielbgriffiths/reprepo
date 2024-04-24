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
  { name: "Connect", path: "/auth/create-connect", icon: faNetworkWired },
  { name: "Addons", path: "/auth/addons", icon: faGrid2Plus },
  { name: "Calendar", path: "/auth/calendar", icon: faCalendar },
];
