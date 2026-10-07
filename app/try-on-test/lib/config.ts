/**
 * Static configuration for the try-on test page. Browser code only needs the
 * try-on-test API endpoints are called from the browser with local test keys.
 * Normal Gemini/Vertex runs exercise /api/v1; OpenAI runs use the isolated
 * test-lab mirror route so model overrides never leak into SDK traffic.
 */
export const TRY_ON_TEST_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000",
  apiKey:
    process.env.NEXT_PUBLIC_PRIMESTYLE_API_KEY ??
    process.env.NEXT_PUBLIC_API_KEY ??
    process.env.PRIMESTYLE_API_KEY ??
    process.env.PS_API_KEY ??
    undefined,
} as const;

export const TRY_ON_TEST_MIRROR_CONFIG = {
  ...TRY_ON_TEST_CONFIG,
  apiKey:
    process.env.NEXT_PUBLIC_PRIMESTYLE_TEST_LAB_API_KEY ??
    process.env.NEXT_PUBLIC_TEST_LAB_API_KEY ??
    TRY_ON_TEST_CONFIG.apiKey,
  apiPrefix: "/api/test-lab/sdk-mirror",
} as const;

export const HISTORY_LIMIT = 20;
