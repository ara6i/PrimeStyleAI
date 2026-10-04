import type { Metadata } from "next";
import { MerchantLandingExperience } from "../partner-landing/merchant/components/MerchantLandingExperience";

export const metadata: Metadata = {
  title: "PrimeStyleAI | Global Commerce Network for Merchants",
  description:
    "Connect products and creators through campaign discovery, merchant analytics, and PDP Studio.",
  icons: { icon: "/merchants/icon.png?v=20261004-round-network" },
};

export default function MerchantLandingPage() {
  return <MerchantLandingExperience />;
}
