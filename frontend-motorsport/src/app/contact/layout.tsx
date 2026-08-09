import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Sarga Motorsport for event support, partnerships, media, merchandise, and IJTC talent-programme inquiries.",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
