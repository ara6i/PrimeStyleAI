export type AdminDashboardTheme = "light" | "dark";

export type AdminDashboardIconKey =
  | "dashboard"
  | "calendar"
  | "revenue"
  | "support"
  | "customers"
  | "stores"
  | "shopify"
  | "sdk"
  | "tickets"
  | "chats"
  | "merchants"
  | "behavior"
  | "analytics"
  | "reports"
  | "settings";

export interface AdminDashboardNavItem {
  label: string;
  href: string;
  icon: AdminDashboardIconKey;
  active: boolean;
  disabled: boolean;
  children?: AdminDashboardNavItem[];
}
