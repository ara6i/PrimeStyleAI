import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { AdminDashboardNavItem } from "../types";
import { AdminDashboardShell } from "./AdminDashboardShell";

vi.mock("./shared/AdminDashboardHeader", () => ({
  AdminDashboardHeader: () => <header>Admin</header>,
}));
vi.mock("./shared/AdminDashboardSidebar", () => ({
  AdminDashboardSidebar: ({
    navItems,
  }: {
    navItems: AdminDashboardNavItem[];
  }) => (
    <nav>
      {navItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>
  ),
}));
vi.mock("./mobile/AdminDashboardMobileNav", () => ({
  AdminDashboardMobileNav: () => <nav>Mobile navigation</nav>,
}));

describe("Admin dashboard responsive shell", () => {
  it("mounts one planning page shared by desktop and mobile and marks its navigation active", () => {
    const markup = renderToStaticMarkup(
      <AdminDashboardShell
        activeHref="/admin/calendar"
        logoutAction={async () => {}}
      >
        <section data-calendar-editor>Planning editor</section>
      </AdminDashboardShell>,
    );
    expect(markup.match(/data-calendar-editor/g)).toHaveLength(1);
    expect(markup.match(/<main /g)).toHaveLength(1);
    expect(markup).toContain(
      'href="/admin/calendar" aria-current="page">Occasion Calendar',
    );
  });
});
