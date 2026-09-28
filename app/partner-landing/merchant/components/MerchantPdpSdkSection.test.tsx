// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MerchantPdpSdkSection } from "./MerchantPdpSdkSection";

const sdk = vi.hoisted(() => ({
  props: null as null | Record<string, unknown>,
}));

vi.mock("@primestyleai/tryon-shop/react", () => ({
  PrimeStyleTryon: (props: Record<string, unknown>) => {
    sdk.props = props;
    return <button type="button">{String(props.buttonText)}</button>;
  },
}));

vi.mock("next/image", () => ({
  default: ({ src, alt }: ComponentProps<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

afterEach(() => {
  cleanup();
  sdk.props = null;
});

describe("Aubergine Coat SDK wiring", () => {
  it("introduces the fitting experience above the product layout", async () => {
    render(<MerchantPdpSdkSection productUrl="/#ai-fitting" />);

    expect(
      screen.getByRole("heading", {
        name: "Try it. Size it. Style the whole look.",
      }),
    ).toBeTruthy();
    expect(screen.getByText("See a demo!")).toBeTruthy();
    expect(
      screen.getByLabelText("See the Aubergine Coat AI fitting demo below"),
    ).toBeTruthy();
    expect(
      await screen.findByRole("button", { name: "Find my size & try it on" }),
    ).toBeTruthy();
  });

  it("shows the coat's single prepared colour without the old footer", async () => {
    render(<MerchantPdpSdkSection productUrl="/#ai-fitting" />);

    await waitFor(() => expect(sdk.props).not.toBeNull());

    expect(screen.getByText("Rich aubergine")).toBeTruthy();
    expect(screen.getByLabelText("Select Rich aubergine")).toBeTruthy();
    expect(screen.queryByLabelText("Select Cobalt")).toBeNull();
    expect(
      screen.queryByRole("button", { name: /previous colour/i }),
    ).toBeNull();
    expect(screen.queryByRole("button", { name: /next colour/i })).toBeNull();
    expect(screen.queryByRole("button", { name: /add to bag/i })).toBeNull();
    expect(screen.queryByText("Added to bag")).toBeNull();
    expect(screen.queryByText("01 / 05")).toBeNull();
    expect(sdk.props).not.toHaveProperty("addToBagLabel");
    expect(sdk.props).not.toHaveProperty("onAddToBag");
  });

  it("sends the new product and its model-worn reference to the Shop SDK", async () => {
    render(<MerchantPdpSdkSection productUrl="/#ai-fitting" />);

    const productImage =
      "/media/global-shop/atelier-sdk-v2/anchor/aubergine-tailored-wool-coat.webp";
    const modelImage = "/media/global-shop/atelier-sdk-v2/results/look-01.webp";

    await waitFor(() =>
      expect(sdk.props).toEqual(
        expect.objectContaining({
          productId: "women-aubergine-tailored-wool-coat",
          productImage,
          productImages: expect.arrayContaining([productImage, modelImage]),
          garmentReferenceImage: modelImage,
          garmentDetailImage: productImage,
          productTitle: "Aubergine Tailored Wool Coat",
          productUrl: "/#ai-fitting",
        }),
      ),
    );
  });

  it("configures the Aubergine Coat with five selectable prepared looks", async () => {
    render(<MerchantPdpSdkSection productUrl="/#ai-fitting" />);

    await waitFor(() => expect(sdk.props).not.toBeNull());

    expect(sdk.props).toEqual(
      expect.objectContaining({
        productCategory: "Women's coats",
        productGender: "female",
        outfitBuilderSource: "ai-stylist",
        guidedDemoAutoplay: true,
        usePresetProfileOnly: true,
        showHeaderControls: false,
        presetProfile: expect.objectContaining({
          id: "atelier-coat-demo-model",
          gender: "female",
          photoUrl:
            "/media/global-shop/sdk-base-models/women-pdp-model-raw-v2.webp",
          height: 168,
          weight: 59,
          heightUnit: "cm",
          weightUnit: "kg",
          braSizeRegion: "US",
          bandSize: "34",
          cupSize: "B",
        }),
      }),
    );

    const looks = sdk.props?.instantOutfitLooks as Array<{
      id: string;
      label?: string;
      items: Array<{ slot: string; image: string }>;
    }>;

    expect(looks).toHaveLength(5);
    expect(looks.map((look) => look.label)).toEqual([
      "Oyster tailoring",
      "Sage contrast",
      "Ecru ease",
      "Charcoal city",
      "Cocoa polish",
    ]);
    expect(
      looks.every(
        (look) =>
          look.items.map((item) => item.slot).join(",") ===
          "bottom,shoe,bag,accessory",
      ),
    ).toBe(true);
    expect(looks.flatMap((look) => look.items)).toHaveLength(20);
    for (const slot of ["bottom", "shoe", "bag", "accessory"]) {
      const selectedIds = looks.map(
        (look) => look.items.find((item) => item.slot === slot)?.image,
      );
      expect(new Set(selectedIds).size).toBe(5);
    }
    expect(
      looks
        .flatMap((look) => look.items)
        .every((item) => item.image.includes("/atelier-sdk-v1/")),
    ).toBe(true);
    expect(
      looks
        .flatMap((look) => look.items)
        .every((item) => item.image.endsWith(".webp")),
    ).toBe(true);

    const itemsWithAlternatives = looks.flatMap((look) => look.items) as Array<{
      slot: string;
      alternatives?: Array<{ image: string }>;
    }>;
    expect(
      itemsWithAlternatives.every((item) => item.alternatives?.length === 4),
    ).toBe(true);

    const results = sdk.props?.instantOutfitResults as Array<{
      lookId: string;
      image: string;
      recommendedSize: string;
    }>;
    expect(results).toHaveLength(5);
    expect(results.every((result) => result.recommendedSize === "M")).toBe(
      true,
    );
    expect(
      results.every((result) =>
        result.image.startsWith("/media/global-shop/atelier-sdk-v2/results/"),
      ),
    ).toBe(true);
    expect(results.map((result) => result.lookId)).toEqual(
      looks.map((look) => look.id),
    );
  });

  it("uses the new raw upload model with prepared tailored results", async () => {
    render(<MerchantPdpSdkSection />);

    await waitFor(() =>
      expect(sdk.props?.presetProfile).toEqual(
        expect.objectContaining({
          photoUrl:
            "/media/global-shop/sdk-base-models/women-pdp-model-raw-v2.webp",
        }),
      ),
    );

    const results = sdk.props?.instantOutfitResults as Array<{ image: string }>;
    expect(results).toHaveLength(5);
    expect(
      results.every((result) =>
        result.image.startsWith("/media/global-shop/atelier-sdk-v2/results/"),
      ),
    ).toBe(true);
  });
});
