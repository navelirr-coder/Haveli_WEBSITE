import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AnimationStage } from "@/components/animation-stage";
import { CursorFollower } from "@/components/cursor-follower";
import "./globals.css";
import "./avaia.css";
import "./signature.css";
import "./packaging.css";

export const metadata: Metadata = {
  title: { default: "Studio Haveli | Brands with character", template: "%s | Studio Haveli" },
  description: "An independent branding practice for people with a voice of their own. Brand strategy, identity, packaging and digital spaces that sound like the people behind them.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body id="top"><a className="skip-link" href="#main-content">Skip to content</a><Navigation /><AnimationStage><main id="main-content" tabIndex={-1}>{children}</main></AnimationStage><Footer /><CursorFollower /></body></html>;
}
