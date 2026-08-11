import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CorporateReportIndex } from "@/components/sections/corporate-report-index";
import { getCorporateReports } from "@/lib/strapi/reports";
import {
  createSitePageMetadata,
  getGatewaySitePageByPath,
} from "@/lib/strapi/site-pages";

const routePath = "/about/sustainability-report";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getGatewaySitePageByPath(routePath);
  return page
    ? createSitePageMetadata(page)
    : {
        title: "Sustainability Report not found",
        robots: { index: false, follow: false },
      };
}

export default async function SustainabilityReportPage() {
  const [page, reports] = await Promise.all([
    getGatewaySitePageByPath(routePath),
    getCorporateReports("sustainability"),
  ]);
  if (!page) notFound();
  return (
    <CorporateReportIndex
      page={page}
      reports={reports}
      reportType="sustainability"
      index="04"
    />
  );
}
