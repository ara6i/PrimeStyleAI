"use client";

import { useMemo, useState } from "react";
import {
  InstagramLogo,
  PinterestLogo,
  ThreadsLogo,
  TiktokLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Globe2,
  Search,
  UsersRound,
} from "lucide-react";
import type {
  ApplicationFilter,
  ApplicationKind,
  ApplicationsViewModel,
  ApplicationLinkView,
  PartnerApplicationView,
} from "../types";

interface ApplicationsPageProps {
  view: ApplicationsViewModel;
}

const KIND_STYLES: Record<ApplicationKind, string> = {
  supplier:
    "bg-amber-50 text-amber-800 dark:bg-amber-950/45 dark:text-amber-200",
  merchant: "bg-blue-50 text-blue-800 dark:bg-blue-950/45 dark:text-blue-200",
  influencer:
    "bg-violet-50 text-violet-800 dark:bg-violet-950/45 dark:text-violet-200",
};

function ApplicationLinkIcon({
  platform,
}: {
  platform: ApplicationLinkView["platform"];
}) {
  const className = "h-[18px] w-[18px] shrink-0";

  switch (platform) {
    case "instagram":
      return (
        <InstagramLogo
          className={`${className} text-pink-600`}
          weight="fill"
          aria-hidden
        />
      );
    case "tiktok":
      return (
        <TiktokLogo
          className={`${className} text-text-primary`}
          weight="fill"
          aria-hidden
        />
      );
    case "threads":
      return (
        <ThreadsLogo
          className={`${className} text-text-primary`}
          weight="fill"
          aria-hidden
        />
      );
    case "youtube":
      return (
        <YoutubeLogo
          className={`${className} text-red-600`}
          weight="fill"
          aria-hidden
        />
      );
    case "pinterest":
      return (
        <PinterestLogo
          className={`${className} text-red-600`}
          weight="fill"
          aria-hidden
        />
      );
    default:
      return <Globe2 className={`${className} text-brand-blue`} aria-hidden />;
  }
}

function ApplicantLinks({ item }: { item: PartnerApplicationView }) {
  if (!item.links.length) return <span className="text-customer-muted">—</span>;

  return (
    <div className="space-y-1.5">
      {item.links.map((link) => (
        <a
          key={`${link.label}:${link.url}`}
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="group flex min-w-0 items-center gap-2 text-sm font-semibold text-brand-blue hover:underline"
        >
          <ApplicationLinkIcon platform={link.platform} />
          <span className="shrink-0">{link.label}</span>
          {link.primary ? (
            <span className="shrink-0 rounded-full bg-customer-blue px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]">
              Primary
            </span>
          ) : null}
          <span className="min-w-0 truncate text-xs font-normal text-customer-muted group-hover:text-brand-blue">
            {link.displayUrl}
          </span>
          <ExternalLink
            className="h-3.5 w-3.5 shrink-0 opacity-65 group-hover:opacity-100"
            aria-hidden
          />
        </a>
      ))}
    </div>
  );
}

function ApplicationDetails({ item }: { item: PartnerApplicationView }) {
  return (
    <dl className="space-y-1.5 text-sm">
      {item.details.map((detail) => (
        <div key={`${detail.label}:${detail.value}`} className="flex gap-2">
          <dt className="shrink-0 text-customer-muted">{detail.label}:</dt>
          <dd className="min-w-0 font-medium text-text-primary">
            {detail.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ApplicationLocation({ item }: { item: PartnerApplicationView }) {
  if (!item.location) return <span className="text-customer-muted">—</span>;

  return (
    <div>
      <p className="flex items-center gap-2 font-semibold text-text-primary">
        {item.countryFlags.length ? (
          <span className="flex shrink-0 items-center -space-x-1">
            {item.countryFlags.slice(0, 4).map((flag, index) => (
              <span
                key={`${flag}:${index}`}
                className="text-xl leading-none"
                role="img"
                aria-label={`${item.location} flag`}
              >
                {flag}
              </span>
            ))}
          </span>
        ) : null}
        <span>{item.location}</span>
      </p>
      <p className="mt-1 text-xs text-customer-muted">
        {item.kind === "supplier" ? "Shipping reach" : "Country or region"}
      </p>
    </div>
  );
}

function ApplicationStatus({ item }: { item: PartnerApplicationView }) {
  const success = item.statusTone === "success";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        success
          ? "bg-customer-success-bg text-customer-success-text"
          : "bg-customer-soft text-customer-muted"
      }`}
    >
      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
      {item.statusLabel}
    </span>
  );
}

function ApplicationsDesktop({ items }: { items: PartnerApplicationView[] }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-customer-card)] border border-customer-border bg-customer-card">
      <table className="w-full min-w-[1280px] border-collapse text-left">
        <thead className="border-b border-customer-border bg-customer-soft text-xs font-semibold uppercase tracking-[0.1em] text-customer-muted">
          <tr>
            <th className="px-5 py-4">Applicant</th>
            <th className="px-5 py-4">Type</th>
            <th className="px-5 py-4">Business or profiles</th>
            <th className="px-5 py-4">Details</th>
            <th className="px-5 py-4">Location</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Joined · New York time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-customer-border">
          {items.map((item) => (
            <tr
              key={item.id}
              className="align-top transition-colors hover:bg-customer-soft/55"
            >
              <td className="max-w-[250px] px-5 py-5">
                <p className="truncate font-semibold text-text-primary">
                  {item.name}
                </p>
                {item.organization ? (
                  <p className="mt-1 truncate text-sm text-customer-muted">
                    {item.organization}
                  </p>
                ) : null}
                <a
                  href={`mailto:${item.email}`}
                  className="mt-1 block truncate text-sm text-brand-blue hover:underline"
                >
                  {item.email}
                </a>
              </td>
              <td className="px-5 py-5">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${KIND_STYLES[item.kind]}`}
                >
                  {item.kindLabel}
                </span>
              </td>
              <td className="max-w-[260px] px-5 py-5">
                <ApplicantLinks item={item} />
              </td>
              <td className="max-w-[320px] px-5 py-5">
                <ApplicationDetails item={item} />
                {item.notes ? (
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-customer-muted">
                    {item.notes}
                  </p>
                ) : null}
              </td>
              <td className="max-w-[210px] px-5 py-5">
                <ApplicationLocation item={item} />
              </td>
              <td className="px-5 py-5">
                <ApplicationStatus item={item} />
              </td>
              <td className="whitespace-nowrap px-5 py-5">
                <p className="text-sm font-medium text-text-primary">
                  {item.joinedNewYorkLabel}
                </p>
                <p className="mt-1 text-xs text-customer-muted">
                  {item.submissionLabel}
                </p>
                {item.submissionLabel !== "1 submission" ? (
                  <p className="mt-1 text-xs text-customer-muted">
                    Latest: {item.lastSubmittedNewYorkLabel}
                  </p>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApplicationsMobile({ items }: { items: PartnerApplicationView[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-customer-border bg-customer-card p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold leading-tight text-text-primary">
                {item.name}
              </h2>
              {item.organization ? (
                <p className="mt-1 text-sm text-customer-muted">
                  {item.organization}
                </p>
              ) : null}
              <a
                href={`mailto:${item.email}`}
                className="mt-1 block break-all text-sm text-brand-blue"
              >
                {item.email}
              </a>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${KIND_STYLES[item.kind]}`}
            >
              {item.kindLabel}
            </span>
          </div>

          <div className="mt-4 border-t border-customer-border pt-3.5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-customer-muted">
              Business or profiles
            </p>
            <ApplicantLinks item={item} />
          </div>

          <div className="mt-4 border-t border-customer-border pt-3.5">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-customer-muted">
              Application details
            </p>
            <ApplicationDetails item={item} />
          </div>

          {item.notes ? (
            <p className="mt-3 text-sm leading-6 text-customer-muted">
              {item.notes}
            </p>
          ) : null}

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5 border-t border-customer-border pt-3.5 text-sm">
            <div>
              <dt className="text-customer-muted">Location</dt>
              <dd className="mt-1 font-semibold text-text-primary">
                <ApplicationLocation item={item} />
              </dd>
            </div>
            <div>
              <dt className="text-customer-muted">Status</dt>
              <dd className="mt-1">
                <ApplicationStatus item={item} />
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-customer-muted">Joined · New York</dt>
              <dd className="mt-1 font-semibold text-text-primary">
                {item.joinedNewYorkLabel}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-customer-muted">
            {item.submissionLabel}
          </p>
        </article>
      ))}
    </div>
  );
}

export function ApplicationsPage({ view }: ApplicationsPageProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ApplicationFilter>("all");
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = useMemo(
    () =>
      view.items.filter(
        (item) =>
          (filter === "all" || item.kind === filter) &&
          (!normalizedQuery || item.searchText.includes(normalizedQuery)),
      ),
    [filter, normalizedQuery, view.items],
  );

  const filters: Array<{
    key: ApplicationFilter;
    label: string;
    count: number;
  }> = [
    { key: "all", label: "All", count: view.summary.total },
    { key: "supplier", label: "Suppliers", count: view.summary.suppliers },
    { key: "merchant", label: "Merchants", count: view.summary.merchants },
    {
      key: "influencer",
      label: "Influencers",
      count: view.summary.influencers,
    },
  ];

  return (
    <section className="space-y-5 max-lg:space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4 max-lg:gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-blue max-lg:text-[11px]">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.04em] text-text-primary lg:text-4xl max-lg:mt-1 max-lg:text-3xl">
            Applications
          </h1>
          <p className="mt-2 text-sm text-customer-muted max-lg:mt-1.5 max-lg:leading-5">
            Suppliers, merchants, and influencers who applied to join
            PrimeStyleAI.
          </p>
          <p className="mt-1 text-xs font-medium text-customer-muted">
            Application timestamps are shown in New York time (ET).
          </p>
        </div>

        <label className="relative w-full max-w-sm max-lg:max-w-none">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-customer-muted"
            aria-hidden
          />
          <span className="sr-only">Search applications</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, company, or profile"
            className="h-11 w-full rounded-xl border border-customer-border bg-customer-card pl-10 pr-3 text-sm text-text-primary outline-none transition focus:border-brand-blue/60"
          />
        </label>
      </div>

      {view.unavailableKinds.length ? (
        <div className="flex gap-3 rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            Could not load: {view.unavailableKinds.join(", ")}. Other available
            application records are still shown.
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-customer-border bg-customer-soft px-4 py-3 text-sm leading-6 text-customer-muted">
        Merchant applications were previously delivered by email only. This list
        starts saving new merchant submissions now; older merchant emails
        require a separate mailbox backfill.
      </div>

      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-lg:gap-3">
        {[
          {
            label: "Waitlist creators",
            value: view.summary.influencers,
            icon: UsersRound,
            featured: true,
          },
          {
            label: "Countries or regions",
            value: view.creatorInsights.countries,
            icon: Globe2,
            featured: false,
          },
          {
            label: "Creators with 50K+ audience",
            value: view.creatorInsights.largerAudienceTotal,
            icon: CheckCircle2,
            featured: false,
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`rounded-[var(--radius-customer-card)] border border-customer-border bg-customer-card p-5 max-lg:rounded-2xl max-lg:p-4 ${
                card.featured ? "max-lg:col-span-2" : ""
              }`}
            >
              <Icon className="h-5 w-5 text-brand-blue" aria-hidden />
              <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-text-primary max-lg:mt-2 max-lg:text-2xl">
                {card.value.toLocaleString("en-US")}
              </p>
              <p className="mt-1 text-sm text-customer-muted max-lg:text-xs">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter applications"
      >
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setFilter(item.key)}
            aria-pressed={filter === item.key}
            className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
              filter === item.key
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-customer-border bg-customer-card text-text-body hover:border-brand-blue/45"
            }`}
          >
            {item.label} · {item.count.toLocaleString("en-US")}
          </button>
        ))}
      </div>

      {filteredItems.length ? (
        <>
          <div className="hidden lg:block">
            <ApplicationsDesktop items={filteredItems} />
          </div>
          <div className="lg:hidden">
            <ApplicationsMobile items={filteredItems} />
          </div>
        </>
      ) : (
        <div className="rounded-[var(--radius-customer-card)] border border-dashed border-customer-border bg-customer-card px-6 py-16 text-center">
          <UsersRound
            className="mx-auto h-9 w-9 text-customer-muted"
            aria-hidden
          />
          <p className="mt-4 text-base font-semibold text-text-primary">
            No matching applications
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-customer-muted">
            Try another filter or search term. New saved applications will
            appear here automatically.
          </p>
        </div>
      )}
    </section>
  );
}
