import type {
  AdminApplicationsResponse,
  ApplicationDetailView,
  ApplicationKind,
  ApplicationLinkView,
  ApplicationsViewModel,
  PartnerApplicationView,
} from "../types";
import { countryFlag } from "../../influencers/mappers/influencersMapper";

const KIND_LABELS: Record<ApplicationKind, string> = {
  supplier: "Supplier",
  merchant: "Merchant",
  influencer: "Influencer",
};

const CREATOR_CHANNEL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  threads: "Threads",
  youtube: "YouTube",
  pinterest: "Pinterest",
  blog: "Blog",
  other: "Other",
};

const AUDIENCE_LABELS: Record<string, string> = {
  "under-10k": "Under 10K audience",
  "10k-50k": "10K–50K audience",
  "50k-250k": "50K–250K audience",
  "250k-1m": "250K–1M audience",
  "1m-plus": "1M+ audience",
};

const SUPPLIER_CATEGORY_LABELS: Record<string, string> = {
  apparel: "Apparel",
  footwear: "Footwear",
  accessories: "Accessories",
  beauty: "Beauty",
  mixed: "Mixed catalog",
  other: "Other category",
};

const CATALOG_LABELS: Record<string, string> = {
  "under-100": "Under 100 products",
  "100-500": "100–500 products",
  "500-2500": "500–2,500 products",
  "2500-plus": "2,500+ products",
};

const SELLING_MODEL_LABELS: Record<string, string> = {
  wholesale: "Wholesale",
  dropship: "Dropship",
  direct: "Direct",
  flexible: "Flexible model",
};

const GOAL_LABELS: Record<string, string> = {
  "merchant-connections": "Merchant connections",
  "influencer-partnerships": "Influencer partnerships",
  "global-distribution": "Global distribution",
  "operations-dashboard": "Operations dashboard",
};

const INTEGRATION_LABELS: Record<string, string> = {
  "react-sdk": "React SDK",
  api: "API",
  shopify: "Shopify app",
  widget: "Widget",
};

function formatNewYorkDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not captured";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
    timeZoneName: "short",
  }).format(date);
}

function displayUrl(value: string): string {
  try {
    const url = new URL(value);
    return `${url.hostname.replace(/^www\./, "")}${
      url.pathname === "/" ? "" : url.pathname
    }`;
  } catch {
    return value;
  }
}

function submissionLabel(count: number): string {
  return count === 1 ? "1 submission" : `${count} submissions`;
}

function detail(label: string, value: string | null | undefined) {
  if (!value) return null;
  return { label, value } satisfies ApplicationDetailView;
}

function buildSearchText(values: Array<string | null | undefined>): string {
  return values.filter(Boolean).join(" ").toLowerCase();
}

function commonFields(input: {
  id: string;
  kind: ApplicationKind;
  name: string;
  email: string;
  organization: string | null;
  links: ApplicationLinkView[];
  details: ApplicationDetailView[];
  location: string | null;
  countryFlags: string[];
  notes: string | null;
  statusLabel: string;
  statusTone: "success" | "neutral";
  firstJoinedAt: string;
  lastSubmittedAt: string;
  submissionCount: number;
}): PartnerApplicationView {
  const lastSubmittedSort = new Date(input.lastSubmittedAt).getTime();
  return {
    id: `${input.kind}:${input.id}`,
    kind: input.kind,
    kindLabel: KIND_LABELS[input.kind],
    name: input.name,
    email: input.email,
    organization: input.organization,
    links: input.links,
    details: input.details,
    location: input.location,
    countryFlags: input.countryFlags,
    notes: input.notes,
    statusLabel: input.statusLabel,
    statusTone: input.statusTone,
    joinedNewYorkLabel: formatNewYorkDate(input.firstJoinedAt),
    lastSubmittedNewYorkLabel: formatNewYorkDate(input.lastSubmittedAt),
    lastSubmittedSort: Number.isNaN(lastSubmittedSort) ? 0 : lastSubmittedSort,
    submissionLabel: submissionLabel(input.submissionCount),
    searchText: buildSearchText([
      input.kind,
      KIND_LABELS[input.kind],
      input.name,
      input.email,
      input.organization,
      input.location,
      input.notes,
      ...input.links.flatMap((link) => [link.label, link.displayUrl]),
      ...input.details.flatMap((item) => [item.label, item.value]),
    ]),
  };
}

export function mapApplications(
  response: AdminApplicationsResponse,
): ApplicationsViewModel {
  const suppliers = response.suppliers.items.map((item) =>
    commonFields({
      id: item.id,
      kind: "supplier",
      name: item.name,
      email: item.email,
      organization: item.company,
      links: [
        {
          label: "Website",
          url: item.website,
          displayUrl: displayUrl(item.website),
          platform: "website",
          primary: true,
        },
      ],
      details: [
        detail(
          "Category",
          SUPPLIER_CATEGORY_LABELS[item.productCategory] ??
            item.productCategory,
        ),
        detail("Catalog", CATALOG_LABELS[item.catalogSize] ?? item.catalogSize),
        detail(
          "Model",
          SELLING_MODEL_LABELS[item.sellingModel] ?? item.sellingModel,
        ),
        detail(
          "Goals",
          item.connectionGoals
            .map((goal) => GOAL_LABELS[goal] ?? goal)
            .join(", "),
        ),
      ].filter((item): item is ApplicationDetailView => item !== null),
      location:
        item.shippingCountryCodes.length > 0
          ? item.shippingCountryCodes.join(", ")
          : item.shippingReach,
      countryFlags: item.shippingCountryCodes
        .map(countryFlag)
        .filter((flag): flag is string => flag !== null),
      notes: item.notes,
      statusLabel: "Submitted",
      statusTone: "success",
      firstJoinedAt: item.firstJoinedAt,
      lastSubmittedAt: item.lastSubmittedAt,
      submissionCount: item.submissionCount,
    }),
  );

  const merchants = response.merchants.items.map((item) =>
    commonFields({
      id: item.id,
      kind: "merchant",
      name: item.name,
      email: item.email,
      organization: item.company,
      links: item.website
        ? [
            {
              label: "Website",
              url: item.website,
              displayUrl: displayUrl(item.website),
              platform: "website",
              primary: true,
            },
          ]
        : [],
      details: [
        detail("Monthly visitors", item.monthlyVisitors),
        detail(
          "Integration",
          INTEGRATION_LABELS[item.toolIntegration] ?? item.toolIntegration,
        ),
        detail("Catalog", item.catalogDescription),
        detail("Data sharing", item.shareData ? "Confirmed" : "Not selected"),
      ].filter((item): item is ApplicationDetailView => item !== null),
      location: null,
      countryFlags: [],
      notes: null,
      statusLabel: "Submitted",
      statusTone: "success",
      firstJoinedAt: item.firstJoinedAt,
      lastSubmittedAt: item.lastSubmittedAt,
      submissionCount: item.submissionCount,
    }),
  );

  const influencers = response.influencers.items.map((item) =>
    commonFields({
      id: item.id,
      kind: "influencer",
      name: item.name,
      email: item.email,
      organization: null,
      links: item.creatorProfiles.map((profile) => ({
        label: CREATOR_CHANNEL_LABELS[profile.platform] ?? profile.platform,
        url: profile.url,
        displayUrl: displayUrl(profile.url),
        platform: profile.platform,
        primary: profile.platform === item.primaryChannel,
      })),
      details: [
        detail(
          "Audience",
          AUDIENCE_LABELS[item.audienceSize] ?? item.audienceSize,
        ),
        detail(
          "Primary channel",
          CREATOR_CHANNEL_LABELS[item.primaryChannel] ?? item.primaryChannel,
        ),
        detail("Timezone", item.timezone),
      ].filter((item): item is ApplicationDetailView => item !== null),
      location: item.location,
      countryFlags: [countryFlag(item.location)].filter(
        (flag): flag is string => flag !== null,
      ),
      notes: null,
      statusLabel: item.marketingConsent
        ? "Consent confirmed"
        : "Consent missing",
      statusTone: item.marketingConsent ? "success" : "neutral",
      firstJoinedAt: item.firstJoinedAt,
      lastSubmittedAt: item.lastSubmittedAt,
      submissionCount: item.submissionCount,
    }),
  );

  return {
    summary: {
      total:
        response.suppliers.summary.total +
        response.merchants.summary.total +
        response.influencers.summary.total,
      suppliers: response.suppliers.summary.total,
      merchants: response.merchants.summary.total,
      influencers: response.influencers.summary.total,
    },
    creatorInsights: {
      countries: response.influencers.summary.countries,
      largerAudienceTotal:
        (response.influencers.summary.audienceSizes["50k-250k"] ?? 0) +
        (response.influencers.summary.audienceSizes["250k-1m"] ?? 0) +
        (response.influencers.summary.audienceSizes["1m-plus"] ?? 0),
    },
    items: [...suppliers, ...merchants, ...influencers].sort(
      (a, b) => b.lastSubmittedSort - a.lastSubmittedSort,
    ),
    unavailableKinds: response.unavailableKinds,
  };
}
