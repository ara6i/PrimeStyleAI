import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import { GlobalShopExperience } from "./shop/components/GlobalShopExperience";
import { ShopReceiptSidebar } from "./shop/components/ShopReceiptSidebar";

const shopSerif = Bodoni_Moda({
  variable: "--font-supplier-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PrimeStyleAI · Fashion, styled and fitted for you",
  description:
    "Discover fashion from connected brands, build complete outfits with an AI stylist, virtually try them on, and shop your best size through PrimeStyleAI.",
  icons: {
    icon: "/merchants/icon.png",
    shortcut: "/merchants/icon.png",
    apple: "/merchants/icon.png",
  },
};

export default function PrimeStyleAIHomePage() {
  return (
    <div className={shopSerif.variable}>
      <GlobalShopExperience />
      <ShopReceiptSidebar />
    </div>
  );
}
