export function getBrandHref(brandId: string): string {
  return `/category/women?brand=${encodeURIComponent(brandId.trim().toLowerCase())}`;
}
