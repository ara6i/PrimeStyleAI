import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ShopReceiptSidebar } from "../shop/components/ShopReceiptSidebar";

export const metadata: Metadata = {
  icons: {
    icon: "/merchants/icon.png",
    shortcut: "/merchants/icon.png",
    apple: "/merchants/icon.png",
  },
};

export default function ShopRoutesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ShopReceiptSidebar />
    </>
  );
}
