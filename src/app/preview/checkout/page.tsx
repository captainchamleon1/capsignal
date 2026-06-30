import type { Metadata } from "next";
import { CheckoutPreviewClient } from "./checkout-preview-client";

export const metadata: Metadata = {
  title: "Checkout preview",
  description: "Internal preview of the checkout offer page.",
  robots: { index: false, follow: false },
};

export default function PreviewCheckoutPage() {
  return <CheckoutPreviewClient />;
}
