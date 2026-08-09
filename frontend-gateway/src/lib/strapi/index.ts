export * from "@/lib/strapi/types";
export { getHomepage } from "@/lib/strapi/homepage";
export { getTimelineItems, getLeadershipPeople } from "@/lib/strapi/about";
export {
  getEcosystemBusinesses,
  getEcosystemBusinessBySlug,
} from "@/lib/strapi/ecosystem";
export { getNewsArticles, getNewsArticleBySlug } from "@/lib/strapi/news";
export { getEvents, getEventBySlug } from "@/lib/strapi/events";
export {
  submitInquiry,
  subscribeNewsletter,
  type InquiryPayload,
  type InquiryType,
  type NewsletterPayload,
} from "@/lib/strapi/forms";
