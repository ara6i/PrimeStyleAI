import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { TabNav } from "../components/TabNav";
import { isTestLabAvailableForHost, normalizeHost } from "../lib/access";

export const metadata = { title: "WEAR oct — PrimeStyleAI" };

export default async function Page() {
  const headerStore = await headers();
  const host = headerStore.get("host");
  if (!isTestLabAvailableForHost(host)) notFound();

  const hostname = normalizeHost(host);
  const local = hostname === "localhost" || hostname === "127.0.0.1";
  const previewUrl = process.env.WEAR_OCT_PREVIEW_URL
    || (local ? `http://${hostname}:3004` : null);

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <TabNav />
      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">WEAR oct</h1>
            <p className="mt-1 text-sm text-slate-600">Aiad’s October photo, front mesh, and WEAR matching work.</p>
          </div>
          {previewUrl ? (
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800">
              Open in a new browser tab
            </a>
          ) : null}
        </div>
        {previewUrl ? (
          <iframe
            src={previewUrl}
            title="WEAR oct — Aiad’s photo and mesh matching lab"
            className="h-[calc(100vh-240px)] min-h-[900px] w-full rounded-xl border border-slate-200 bg-white"
            allow="fullscreen"
          />
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-700">
            The WEAR oct preview service has not been connected on this host.
          </p>
        )}
      </main>
    </div>
  );
}
