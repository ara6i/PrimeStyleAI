import type {
  BrandEditorialAssets,
  EditorialStory,
} from "../types/brandCatalog.types";

export const brandEditorialAssets: BrandEditorialAssets = {
  dropped: "/media/global-shop/brand-editorial/brand-drop-four-panel.webp",
  gender: "/media/global-shop/brand-editorial/brand-gender-collage.webp",
  promos: "/media/global-shop/brand-editorial/brand-promos-three-panel.webp",
  news: "/media/global-shop/brand-editorial/brand-news-three-panel.webp",
};

export const editorialPromoStories: EditorialStory[] = [
  {
    eyebrow: "Sunglasses",
    title: "Beach days, sharpened",
    href: "/category/accessories",
  },
  {
    eyebrow: "Movement",
    title: "Activewear, reworked",
    href: "/category/men",
  },
  {
    eyebrow: "Accessories",
    title: "The new carry",
    href: "/category/accessories",
  },
];

export const editorialNewsStories: EditorialStory[] = [
  {
    eyebrow: "Summer edit",
    title: "The coast collection",
    href: "/category/women",
  },
  {
    eyebrow: "Travel edit",
    title: "Looks built to move",
    href: "/category/men",
  },
  {
    eyebrow: "Cold weather",
    title: "The luxury layer",
    href: "/category/women",
  },
];
