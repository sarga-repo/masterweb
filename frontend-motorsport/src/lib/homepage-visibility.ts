export function isHomepageEventVisible(event: {
  eventStatus: string;
  showOnMotorsport?: boolean;
}) {
  return event.eventStatus !== "hidden" && event.showOnMotorsport !== false;
}

export function isHomepageArticleVisible(article: {
  showOnMotorsport?: boolean;
}) {
  return article.showOnMotorsport !== false;
}

export function isHomepagePartnerVisible(partner: { isActive?: boolean }) {
  return partner.isActive !== false;
}

export function orderHomepageArticles<T extends { featuredOnMotorsport?: boolean }>(
  articles: T[],
) {
  return [
    ...articles.filter((article) => article.featuredOnMotorsport === true),
    ...articles.filter((article) => article.featuredOnMotorsport !== true),
  ];
}
