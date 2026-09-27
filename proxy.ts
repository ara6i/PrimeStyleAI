import { NextResponse, type NextRequest } from "next/server";
import {
  isSiteAuthEnabled,
  SITE_AUTH_COOKIE_NAME,
  verifySiteSessionToken,
} from "@/app/shared/auth/siteSession";
import {
  isTestLabAvailableForHost,
  isTryOnTestApiPath,
  isTryOnTestPath,
  normalizeHost,
} from "@/app/try-on-test/lib/access";

// Domains that should serve the /admin tree as their root.
// Configurable via ADMIN_HOSTS (comma-separated) to avoid hard-coding env-specific hosts.
const DEFAULT_ADMIN_HOSTS = [
  "admin.primestyleai.com",
  "admin.primestyle.ai",
  "admin.localhost",
];

const DEFAULT_CREATOR_HOSTS = [
  "creators.primestyleai.com",
  "creators.localhost",
];
const DEFAULT_SUPPLIER_HOSTS = [
  "suppliers.primestyleai.com",
  "suppliers.localhost",
];
const PRIMARY_PUBLIC_HOSTS = new Set([
  "primestyleai.com",
  "www.primestyleai.com",
]);
const LIVE_HOMEPAGE_REDIRECT_PREFIXES = [
  "/admin",
  "/creators/dashboard",
  "/customer",
  "/dashboard",
  "/demo",
  "/developer",
  "/docs",
  "/influencers/dashboard",
  "/login",
  "/merchants/dashboard",
  "/pdp-studio",
  "/status",
  "/suppliers/dashboard",
  "/test-lab",
  "/try-on-test",
] as const;
const CREATOR_LANDING_PATH = "/creators";
const SUPPLIER_LANDING_PATH = "/suppliers";
const CREATOR_PUBLIC_API_PATHS = new Set([
  "/api/contact/notify",
  "/api/creator-profiles/validate",
]);
const CREATOR_LEGAL_PATHS = new Set(["/privacy-policy", "/terms"]);
const PUBLIC_SITE_AUTH_PATH_PREFIXES = [
  "/merchants",
  "/suppliers",
  "/creators",
  "/shop",
  "/influencers/dashboard",
  "/product",
  "/category",
  "/brand",
  "/prepared-results",
  "/pdp-studio",
] as const;

export function isPublicSiteAuthPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_SITE_AUTH_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function shouldRedirectLivePageToHomepage(
  host: string,
  pathname: string,
): boolean {
  if (!PRIMARY_PUBLIC_HOSTS.has(normalizeHost(host))) return false;

  return LIVE_HOMEPAGE_REDIRECT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function getConfiguredHosts(
  environmentValue: string | undefined,
  defaults: string[],
): string[] {
  if (!environmentValue) return defaults;
  return environmentValue
    .split(",")
    .map((host) => normalizeHost(host))
    .filter(Boolean);
}

function getAdminHosts(): string[] {
  return getConfiguredHosts(process.env.ADMIN_HOSTS, DEFAULT_ADMIN_HOSTS);
}

export async function proxy(req: NextRequest) {
  const host = normalizeHost(req.headers.get("host"));
  const adminHosts = getAdminHosts();
  const isAdminHost = adminHosts.includes(host);
  const isCreatorHost = getConfiguredHosts(
    process.env.CREATOR_HOSTS,
    DEFAULT_CREATOR_HOSTS,
  ).includes(host);
  const isSupplierHost = getConfiguredHosts(
    process.env.SUPPLIER_HOSTS,
    DEFAULT_SUPPLIER_HOSTS,
  ).includes(host);
  const siteAuthEnabled = isSiteAuthEnabled();

  const url = req.nextUrl;
  const pathname = url.pathname;
  const isSiteLoginPath =
    pathname === "/login" || pathname.startsWith("/login/");
  const isTryOnTestRoute = isTryOnTestPath(pathname);
  const isTryOnTestApiRoute = isTryOnTestApiPath(pathname);

  if (
    (req.method === "GET" || req.method === "HEAD") &&
    shouldRedirectLivePageToHomepage(host, pathname)
  ) {
    const homepage = url.clone();
    homepage.pathname = "/";
    homepage.search = "";
    return NextResponse.redirect(homepage);
  }

  // The creator subdomain is a focused public site. Its root serves the
  // influencer landing internally, while its creator Terms and Privacy Policy
  // remain directly accessible. The waitlist APIs also remain available.
  if (isCreatorHost) {
    if (pathname === "/" || pathname === "") {
      const rewritten = url.clone();
      rewritten.pathname = CREATOR_LANDING_PATH;
      return NextResponse.rewrite(rewritten);
    }

    if (CREATOR_PUBLIC_API_PATHS.has(pathname)) {
      if (req.method === "POST" || req.method === "OPTIONS") {
        return NextResponse.next();
      }
      return new NextResponse("Not found", { status: 404 });
    }

    if (CREATOR_LEGAL_PATHS.has(pathname)) {
      return NextResponse.next();
    }

    if (pathname.startsWith("/api/")) {
      return new NextResponse("Not found", { status: 404 });
    }

    const creatorRoot = url.clone();
    creatorRoot.pathname = "/";
    creatorRoot.search = "";
    return NextResponse.redirect(creatorRoot);
  }

  // The supplier subdomain shares the same application release. Its root
  // renders the canonical supplier landing while /suppliers remains available
  // on the main domain.
  if (isSupplierHost && (pathname === "/" || pathname === "")) {
    const rewritten = url.clone();
    rewritten.pathname = SUPPLIER_LANDING_PATH;
    return NextResponse.rewrite(rewritten);
  }

  if (
    (isTryOnTestRoute || isTryOnTestApiRoute) &&
    !isTestLabAvailableForHost(host)
  ) {
    if (isTryOnTestApiRoute) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return new NextResponse("Not found", { status: 404 });
  }

  // ── Local/staging protected-route gate ──
  // Enabled only by env. Merchant, supplier, Shop, and creator-dashboard
  // surfaces stay public; every other matched page/API requires the signed,
  // HTTP-only staging session cookie.
  if (
    siteAuthEnabled &&
    !isSiteLoginPath &&
    !isPublicSiteAuthPath(pathname)
  ) {
    const token = req.cookies.get(SITE_AUTH_COOKIE_NAME)?.value || "";
    const payload = token ? await verifySiteSessionToken(token) : null;

    if (!payload) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const redirectUrl = url.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.search = `?from=${encodeURIComponent(pathname + url.search)}`;
      return NextResponse.redirect(redirectUrl);
    }
  }

  // On the admin subdomain: rewrite every path to its /admin/* counterpart.
  if (isAdminHost) {
    if (pathname === "/" || pathname === "") {
      const rewritten = url.clone();
      rewritten.pathname = "/admin";
      return NextResponse.rewrite(rewritten);
    }
    if (
      !pathname.startsWith("/admin") &&
      !pathname.startsWith("/api") &&
      !pathname.startsWith("/_next") &&
      !(siteAuthEnabled && isSiteLoginPath)
    ) {
      const rewritten = url.clone();
      rewritten.pathname = `/admin${pathname}`;
      return NextResponse.rewrite(rewritten);
    }
    return NextResponse.next();
  }

  // /admin/* passes through on any host — accessible at both
  // admin.primestyleai.com/* and primestyleai.com/admin/*.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on everything except Next internals, static files, and favicon.
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
