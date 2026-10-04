import { describe, expect, it } from "vitest";
import { mapProductSizeGuide } from "./productSizeGuide.mapper";
import type { ProductDetailViewModel } from "../types/productDetail.types";

const product = (sizes: string[], sizeGuide?: ProductDetailViewModel["sizeGuide"]) =>
  ({ name: "Tailored coat", category: "Women’s outerwear", sizes, sizeGuide }) as ProductDetailViewModel;

describe("product size guides", () => {
  it("preserves a supplied chart and its measurement units exactly", () => {
    const guide = { title: "Brand body ranges", headers: ["Size", "Bust (in)"], rows: [["M", "35–37"]] };
    expect(mapProductSizeGuide(product(["M"], guide))).toBe(guide);
  });

  it.each([["XS", "S", "M"], ["28", "29", "30"], ["One size"]])("does not fabricate body measurements from size labels: %s", (...sizes) => {
    const guide = mapProductSizeGuide(product(sizes));
    expect(guide.headers).toEqual(["Size"]);
    expect(guide.rows).toEqual(sizes.map(size => [size]));
    expect(guide.title).toContain("measurements unavailable");
  });
});
