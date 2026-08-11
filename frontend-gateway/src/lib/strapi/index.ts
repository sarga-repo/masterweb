export * from "@/lib/strapi/types";
export { getHomepage } from "@/lib/strapi/homepage";
export { getTimelineItems, getLeadershipPeople } from "@/lib/strapi/about";
export {
  getEcosystemBusinesses,
  getEcosystemBusinessBySlug,
} from "@/lib/strapi/ecosystem";
export { getGatewaySitePageByPath } from "@/lib/strapi/site-pages";
export { getNewsArticles, getNewsArticleBySlug } from "@/lib/strapi/news";
export { getCorporateReports } from "@/lib/strapi/reports";
export { getJobVacancies, getJobVacancyBySlug } from "@/lib/strapi/jobs";
export { getEvents, getEventBySlug } from "@/lib/strapi/events";
export {
  submitInquiry,
  subscribeNewsletter,
  type InquiryPayload,
  type InquiryType,
  type NewsletterPayload,
} from "@/lib/strapi/forms";
