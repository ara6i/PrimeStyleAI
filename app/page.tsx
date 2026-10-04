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
  title: "PrimeStyleAI · Global Fashion Shopping Network",
  description: "Global Fashion Shopping Network",
  openGraph: {
    title: "PrimeStyleAI · Global Fashion Shopping Network",
    description: "Global Fashion Shopping Network",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PrimeStyleAI · Global Fashion Shopping Network",
    description: "Global Fashion Shopping Network",
  },
  icons: {
    icon: "/merchants/icon.png",
    shortcut: "/merchants/icon.png",
    apple: "/merchants/icon.png",
  },
};

// Keep the production root in sync with the shop experience.
export default function PrimeStyleAIHomePage() {
  return (
    <div className={shopSerif.variable}>
      <GlobalShopExperience />
      <ShopReceiptSidebar />
    </div>
  );
}
