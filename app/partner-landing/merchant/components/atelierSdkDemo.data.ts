import type {
  PrimeStyleInstantOutfitResult,
  PrimeStyleOutfitItem,
  PrimeStyleOutfitLook,
  PrimeStyleOutfitSlot,
} from "@primestyleai/tryon-shop/react";

export const ATELIER_PRODUCT_ID = "women-aubergine-tailored-wool-coat";
export const ATELIER_PRODUCT_NAME = "Aubergine Tailored Wool Coat";
export const ATELIER_ASSET_ROOT = "/media/global-shop/atelier-sdk-v1";
export const ATELIER_RESULT_ASSET_ROOT =
  "/media/global-shop/atelier-sdk-v2/results";
export const ATELIER_PRODUCT_IMAGE =
  "/media/global-shop/atelier-sdk-v2/anchor/aubergine-tailored-wool-coat.webp";
export const ATELIER_RAW_MODEL_PHOTO =
  "/media/global-shop/sdk-base-models/women-pdp-model-raw-v2.webp";

type OutfitOption = Omit<PrimeStyleOutfitItem, "alternatives" | "selected">;

function option(
  slot: PrimeStyleOutfitSlot,
  productId: string,
  title: string,
  image: string,
  color: string,
  recommendedSize: string,
): OutfitOption {
  return {
    slot,
    productId,
    title,
    image,
    displayImage: image,
    url: "/#ai-fitting",
    color,
    garmentType: title,
    recommendedSize,
  };
}

const BOTTOMS = [
  option(
    "bottom",
    "atelier-oyster-wide-leg-trouser",
    "Oyster Wide-Leg Trouser",
    `${ATELIER_ASSET_ROOT}/bottoms/oyster-wide-leg-trouser.webp`,
    "Oyster",
    "M",
  ),
  option(
    "bottom",
    "atelier-sage-satin-midi-skirt",
    "Sage Satin Midi Skirt",
    `${ATELIER_ASSET_ROOT}/bottoms/sage-satin-midi-skirt.webp`,
    "Soft sage",
    "M",
  ),
  option(
    "bottom",
    "atelier-ecru-straight-leg-jean",
    "Ecru Straight-Leg Jean",
    `${ATELIER_ASSET_ROOT}/bottoms/ecru-straight-leg-jean.webp`,
    "Ecru",
    "29",
  ),
  option(
    "bottom",
    "atelier-charcoal-pleated-trouser",
    "Charcoal Pleated Trouser",
    `${ATELIER_ASSET_ROOT}/bottoms/charcoal-pleated-trouser.webp`,
    "Charcoal",
    "M",
  ),
  option(
    "bottom",
    "atelier-cocoa-column-skirt",
    "Cocoa Column Skirt",
    `${ATELIER_ASSET_ROOT}/bottoms/cocoa-column-skirt.webp`,
    "Cocoa",
    "M",
  ),
] as const;

const SHOES = [
  option(
    "shoe",
    "atelier-oxblood-pointed-slingback",
    "Oxblood Pointed Slingback",
    `${ATELIER_ASSET_ROOT}/shoes/oxblood-pointed-slingback.webp`,
    "Oxblood",
    "US 8",
  ),
  option(
    "shoe",
    "atelier-ivory-kitten-heel-pump",
    "Ivory Kitten-Heel Pump",
    `${ATELIER_ASSET_ROOT}/shoes/ivory-kitten-heel-pump.webp`,
    "Ivory",
    "US 8",
  ),
  option(
    "shoe",
    "atelier-taupe-suede-court-sneaker",
    "Taupe Suede Court Sneaker",
    `${ATELIER_ASSET_ROOT}/shoes/taupe-suede-court-sneaker.webp`,
    "Taupe",
    "US 8",
  ),
  option(
    "shoe",
    "atelier-black-leather-ankle-boot",
    "Black Leather Ankle Boot",
    `${ATELIER_ASSET_ROOT}/shoes/black-leather-ankle-boot.webp`,
    "Black",
    "US 8",
  ),
  option(
    "shoe",
    "atelier-espresso-mary-jane",
    "Espresso Mary Jane",
    `${ATELIER_ASSET_ROOT}/shoes/espresso-mary-jane.webp`,
    "Espresso",
    "US 8",
  ),
] as const;

const BAGS = [
  option(
    "bag",
    "atelier-taupe-crescent-shoulder-bag",
    "Taupe Crescent Shoulder Bag",
    `${ATELIER_ASSET_ROOT}/bags/taupe-crescent-shoulder-bag.webp`,
    "Taupe",
    "One size",
  ),
  option(
    "bag",
    "atelier-burgundy-mini-top-handle-bag",
    "Burgundy Mini Top-Handle Bag",
    `${ATELIER_ASSET_ROOT}/bags/burgundy-mini-top-handle-bag.webp`,
    "Burgundy",
    "One size",
  ),
  option(
    "bag",
    "atelier-espresso-sculpted-crossbody",
    "Espresso Sculpted Crossbody",
    `${ATELIER_ASSET_ROOT}/bags/espresso-sculpted-crossbody.webp`,
    "Espresso",
    "One size",
  ),
  option(
    "bag",
    "atelier-black-east-west-bag",
    "Black East-West Bag",
    `${ATELIER_ASSET_ROOT}/bags/black-east-west-bag.webp`,
    "Black",
    "One size",
  ),
  option(
    "bag",
    "atelier-champagne-woven-shoulder-bag",
    "Champagne Woven Shoulder Bag",
    `${ATELIER_ASSET_ROOT}/bags/champagne-woven-clutch.webp`,
    "Champagne",
    "One size",
  ),
] as const;

const ACCESSORIES = [
  option(
    "accessory",
    "atelier-brushed-gold-oval-hoops",
    "Brushed-Gold Oval Hoops",
    `${ATELIER_ASSET_ROOT}/accessories/brushed-gold-oval-hoops.webp`,
    "Brushed gold",
    "One size",
  ),
  option(
    "accessory",
    "atelier-pearl-drop-earrings",
    "Pearl Drop Earrings",
    `${ATELIER_ASSET_ROOT}/accessories/pearl-drop-earrings.webp`,
    "Pearl / gold",
    "One size",
  ),
  option(
    "accessory",
    "atelier-aubergine-ivory-silk-scarf",
    "Aubergine & Ivory Silk Scarf",
    `${ATELIER_ASSET_ROOT}/accessories/aubergine-ivory-silk-scarf.webp`,
    "Aubergine / ivory",
    "One size",
  ),
  option(
    "accessory",
    "atelier-sculptural-gold-cuff",
    "Sculptural Gold Cuff",
    `${ATELIER_ASSET_ROOT}/accessories/sculptural-gold-cuff.webp`,
    "Polished gold",
    "One size",
  ),
  option(
    "accessory",
    "atelier-smoky-tortoiseshell-sunglasses",
    "Smoky Tortoiseshell Sunglasses",
    `${ATELIER_ASSET_ROOT}/accessories/smoky-tortoiseshell-sunglasses.webp`,
    "Smoky tortoiseshell",
    "52 mm",
  ),
] as const;

const OPTION_GROUPS = [BOTTOMS, SHOES, BAGS, ACCESSORIES] as const;
const LOOK_LABELS = [
  "Oyster tailoring",
  "Sage contrast",
  "Ecru ease",
  "Charcoal city",
  "Cocoa polish",
] as const;

function itemWithAlternatives(
  options: readonly OutfitOption[],
  selectedIndex: number,
): PrimeStyleOutfitItem {
  const selected = options[selectedIndex];

  return {
    ...selected,
    selected: true,
    alternatives: options
      .filter((_, index) => index !== selectedIndex)
      .map((candidate) => ({ ...candidate })),
  };
}

export const ATELIER_OUTFIT_LOOKS: PrimeStyleOutfitLook[] = LOOK_LABELS.map(
  (label, index) => ({
    id: `${ATELIER_PRODUCT_ID}-look-${index + 1}`,
    label,
    items: OPTION_GROUPS.map((options) => itemWithAlternatives(options, index)),
  }),
);

export const ATELIER_OUTFIT_RESULTS: PrimeStyleInstantOutfitResult[] =
  ATELIER_OUTFIT_LOOKS.map((look, index) => ({
    lookId: look.id,
    image: `${ATELIER_RESULT_ASSET_ROOT}/look-0${index + 1}.webp`,
    recommendedSize: "M",
    confidence: "illustrative",
    reasoning:
      "Size M is a sample selection for this prepared demo, not a measured fit recommendation.",
  }));
