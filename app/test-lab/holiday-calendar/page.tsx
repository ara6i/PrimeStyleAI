import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { normalizeHost } from "@/app/try-on-test/lib/access";
import { AdminDashboardThemeProvider } from "@/app/admin/(protected)/components/shared/AdminDashboardThemeProvider";
import { HolidayCalendar } from "@/app/admin/(protected)/calendar/components/HolidayCalendar";
import { PreviewThemeToggle } from "./themeToggle";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Local calendar preview | PrimeStyleAI",
  robots: { index: false, follow: false },
};

export default async function CalendarPreview() {
  const host = normalizeHost((await headers()).get("host"));
  if (
    process.env.NODE_ENV !== "development" ||
    !["localhost", "127.0.0.1", "::1"].includes(host)
  )
    notFound();
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(new Date());
  return (
    <AdminDashboardThemeProvider>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-customer-border bg-customer-card px-5 py-4 text-sm">
        <span className="flex items-center gap-2 font-semibold">
          <CalendarDays size={20} /> PrimeStyleAI{" "}
          <span className="font-normal text-customer-muted">
            / Local admin calendar preview
          </span>
        </span>
        <div className="flex items-center gap-4">
          <PreviewThemeToggle />
          <Link className="text-brand-blue" href="/admin/calendar">
            Open admin dashboard →
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-8">
        <HolidayCalendar today={today} />
      </main>
    </AdminDashboardThemeProvider>
  );
}
