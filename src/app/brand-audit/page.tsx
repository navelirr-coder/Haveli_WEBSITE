import type { Metadata } from "next";
import { BrandAudit } from "@/components/brand-audit";
export const metadata: Metadata = { title:"Brand Audit", description:"Take Studio Haveli’s 25-question Brand Diagnostic. Explore your brand’s strategy, identity, packaging, website and trust." };
export default function AuditPage() { return <BrandAudit />; }
