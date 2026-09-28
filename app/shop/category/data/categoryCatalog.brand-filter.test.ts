// @vitest-environment node

import { describe, expect, it } from "vitest";
import { getShowcaseProductsByGender } from "../../data/showcaseCatalog.data";
import { SHOP_CATEGORY_IDS } from "../types/categoryCatalog.types";
import { categoryCatalogData } from "./categoryCatalog.data";

describe("Women showcase collection", () => {
  it("ends at Burgundy Silk Scarf without appending old catalog products", () => {
    expect(SHOP_CATEGORY_IDS).toEqual(["women", "men", "accessories"]);
    expect(categoryCatalogData.map((catalog) => catalog.id).sort()).toEqual([
      "accessories",
      "men",
      "women",
    ]);
    const women = categoryCatalogData.find((catalog) => catalog.id === "women");
    const expectedIds = getShowcaseProductsByGender("women").map(
      (product) => product.id,
    );

    expect(women?.products.map((product) => product.id)).toEqual(expectedIds);
    expect(women?.products.at(-1)?.id).toBe("women-burgundy-silk-scarf");
    expect(
      women?.products.some((product) => product.id === "denim-light-wide-leg"),
    ).toBe(false);
  });
});
