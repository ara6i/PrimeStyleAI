import { logoutAction } from "@/app/admin/login/actions";
import { AdminDashboardShell } from "../components/AdminDashboardShell";
import { AdminDashboardThemeProvider } from "../components/shared/AdminDashboardThemeProvider";
import { ApplicationsPage } from "./components/ApplicationsPage";
import { mapApplications } from "./mappers/applicationsMapper";
import { fetchAdminApplications } from "./services/applicationsService";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage() {
  const response = await fetchAdminApplications();
  const view = mapApplications(response);

  return (
    <AdminDashboardThemeProvider>
      <AdminDashboardShell
        logoutAction={logoutAction}
        activeHref="/admin/applications"
      >
        <ApplicationsPage view={view} />
      </AdminDashboardShell>
    </AdminDashboardThemeProvider>
  );
}
