import type {
  ProductDetailViewModel,
  ProductSizeGuideData,
} from "../types/productDetail.types";

/** Size labels alone cannot establish brand-specific body or garment measurements. */
export function mapProductSizeGuide(
  product: ProductDetailViewModel,
): ProductSizeGuideData {
  if (product.sizeGuide) return product.sizeGuide;
  return {
    title: `${product.name} · measurements unavailable`,
    headers: ["Size"],
    rows: product.sizes.map((size) => [size]),
  };
}
