import { logoutAction } from "@/app/admin/login/actions";
import { AdminDashboardShell } from "../components/AdminDashboardShell";
import { AdminDashboardThemeProvider } from "../components/shared/AdminDashboardThemeProvider";
import { HolidayCalendar } from "./components/HolidayCalendar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Occasion Calendar | Prime Admin" };

export default function AdminCalendarPage() {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
  }).format(new Date());
  return (
    <AdminDashboardThemeProvider>
      <AdminDashboardShell
        activeHref="/admin/calendar"
        logoutAction={logoutAction}
      >
        <HolidayCalendar today={today} />
      </AdminDashboardShell>
    </AdminDashboardThemeProvider>
  );
}
