import { adminFetch } from "@/app/admin/shared/services/adminFetch";
import type { AdminCreatorWaitlistResponse } from "../../influencers/types";
import type {
  AdminApplicationsResponse,
  AdminMerchantWaitlistResponse,
  AdminSupplierWaitlistResponse,
  ApplicationKind,
} from "../types";

function emptyPagination(limit: number) {
  return { page: 1, limit, total: 0, totalPages: 1 };
}

function emptySuppliers(limit: number): AdminSupplierWaitlistResponse {
  return {
    summary: { total: 0 },
    items: [],
    pagination: emptyPagination(limit),
  };
}

function emptyMerchants(limit: number): AdminMerchantWaitlistResponse {
  return {
    summary: { total: 0 },
    items: [],
    pagination: emptyPagination(limit),
  };
}

function emptyInfluencers(limit: number): AdminCreatorWaitlistResponse {
  return {
    summary: { total: 0, countries: 0, audienceSizes: {} },
    items: [],
    pagination: emptyPagination(limit),
  };
}

export async function fetchAdminApplications(
  limit = 500,
): Promise<AdminApplicationsResponse> {
  const params = new URLSearchParams({ page: "1", limit: String(limit) });
  const [suppliersResult, merchantsResult, influencersResult] =
    await Promise.allSettled([
      adminFetch<AdminSupplierWaitlistResponse>(
        `/api/admin/supplier-waitlist?${params.toString()}`,
      ),
      adminFetch<AdminMerchantWaitlistResponse>(
        `/api/admin/merchant-waitlist?${params.toString()}`,
      ),
      adminFetch<AdminCreatorWaitlistResponse>(
        `/api/admin/creator-waitlist?${params.toString()}`,
      ),
    ]);

  const unavailableKinds: ApplicationKind[] = [];
  if (suppliersResult.status === "rejected") unavailableKinds.push("supplier");
  if (merchantsResult.status === "rejected") unavailableKinds.push("merchant");
  if (influencersResult.status === "rejected")
    unavailableKinds.push("influencer");

  return {
    suppliers:
      suppliersResult.status === "fulfilled"
        ? suppliersResult.value
        : emptySuppliers(limit),
    merchants:
      merchantsResult.status === "fulfilled"
        ? merchantsResult.value
        : emptyMerchants(limit),
    influencers:
      influencersResult.status === "fulfilled"
        ? influencersResult.value
        : emptyInfluencers(limit),
    unavailableKinds,
  };
}
