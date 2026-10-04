import type { Metadata } from "next";
import { Bodoni_Moda } from "next/font/google";
import { GlobalShopExperience } from "./components/GlobalShopExperience";

const supplierSerif = Bodoni_Moda({
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
};

export default function GlobalShopPage() {
  return (
    <div className={supplierSerif.variable}>
      <GlobalShopExperience />
    </div>
  );
}
