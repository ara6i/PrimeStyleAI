import type {
  AdminCreatorWaitlistResponse,
  CreatorChannel,
} from "../../influencers/types";

export type ApplicationKind = "supplier" | "merchant" | "influencer";
export type ApplicationFilter = "all" | ApplicationKind;

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SupplierWaitlistApplicationRaw {
  id: string;
  name: string;
  email: string;
  company: string;
  website: string;
  productCategory: string;
  catalogSize: string;
  sellingModel: string;
  shippingReach: string;
  shippingCountryCodes: string[];
  connectionGoals: string[];
  notes: string | null;
  firstJoinedAt: string;
  lastSubmittedAt: string;
  submissionCount: number;
}

export interface AdminSupplierWaitlistResponse {
  summary: { total: number };
  items: SupplierWaitlistApplicationRaw[];
  pagination: Pagination;
}

export interface MerchantWaitlistApplicationRaw {
  id: string;
  name: string;
  email: string;
  company: string;
  website: string | null;
  monthlyVisitors: string;
  catalogDescription: string | null;
  toolIntegration: "react-sdk" | "api" | "shopify" | "widget";
  shareData: boolean;
  firstJoinedAt: string;
  lastSubmittedAt: string;
  submissionCount: number;
}

export interface AdminMerchantWaitlistResponse {
  summary: { total: number };
  items: MerchantWaitlistApplicationRaw[];
  pagination: Pagination;
}

export interface AdminApplicationsResponse {
  suppliers: AdminSupplierWaitlistResponse;
  merchants: AdminMerchantWaitlistResponse;
  influencers: AdminCreatorWaitlistResponse;
  unavailableKinds: ApplicationKind[];
}

export interface ApplicationLinkView {
  label: string;
  url: string;
  displayUrl: string;
  platform: CreatorChannel | "website";
  primary: boolean;
}

export interface ApplicationDetailView {
  label: string;
  value: string;
}

export interface PartnerApplicationView {
  id: string;
  kind: ApplicationKind;
  kindLabel: string;
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
  joinedNewYorkLabel: string;
  lastSubmittedNewYorkLabel: string;
  lastSubmittedSort: number;
  submissionLabel: string;
  searchText: string;
}

export interface ApplicationsViewModel {
  summary: {
    total: number;
    suppliers: number;
    merchants: number;
    influencers: number;
  };
  creatorInsights: {
    countries: number;
    largerAudienceTotal: number;
  };
  items: PartnerApplicationView[];
  unavailableKinds: ApplicationKind[];
}
