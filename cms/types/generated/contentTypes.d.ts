import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    adminPermissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::permission'
    >;
    adminUserOwner: Schema.Attribute.Relation<'manyToOne', 'admin::user'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    kind: Schema.Attribute.Enumeration<['content-api', 'admin']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'content-api'>;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    apiToken: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminSession extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_sessions';
  info: {
    description: 'Session Manager storage';
    displayName: 'Session';
    name: 'Session';
    pluralName: 'sessions';
    singularName: 'session';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
    i18n: {
      localized: false;
    };
  };
  attributes: {
    absoluteExpiresAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    childId: Schema.Attribute.String & Schema.Attribute.Private;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    deviceId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    expiresAt: Schema.Attribute.DateTime &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::session'> &
      Schema.Attribute.Private;
    origin: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sessionId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique;
    status: Schema.Attribute.String & Schema.Attribute.Private;
    type: Schema.Attribute.String & Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    userId: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    apiTokens: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiEcosystemBusinessEcosystemBusiness
  extends Struct.CollectionTypeSchema {
  collectionName: 'ecosystem_businesses';
  info: {
    description: 'A Sarga business or intellectual property';
    displayName: 'Ecosystem Business';
    pluralName: 'ecosystem-businesses';
    singularName: 'ecosystem-business';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    businessStatus: Schema.Attribute.Enumeration<
      ['active', 'comingSoon', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'active'>;
    cardImage: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Find Out More'>;
    ctaUrl: Schema.Attribute.String;
    dedicatedSiteKey: Schema.Attribute.Enumeration<
      ['none', 'motorsport', 'horsesport']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    dedicatedSiteUrl: Schema.Attribute.String;
    gallery: Schema.Attribute.Media<'images' | 'videos', true>;
    heroImage: Schema.Attribute.Media<'images'>;
    highlights: Schema.Attribute.Component<'shared.key-highlight', true>;
    launchTarget: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::ecosystem-business.ecosystem-business'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    overview: Schema.Attribute.RichText;
    pillar: Schema.Attribute.Enumeration<
      ['sports', 'venue', 'media', 'technology', 'festival', 'other']
    > &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    relatedArticles: Schema.Attribute.Relation<
      'manyToMany',
      'api::news-article.news-article'
    >;
    relatedEvents: Schema.Attribute.Relation<'oneToMany', 'api::event.event'>;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    shortDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'shared'>;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiEventEvent extends Struct.CollectionTypeSchema {
  collectionName: 'events';
  info: {
    description: 'Live events and approved partner ticket destinations';
    displayName: 'Event';
    pluralName: 'events';
    singularName: 'event';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    broadcastUrl: Schema.Attribute.String;
    business: Schema.Attribute.Relation<
      'manyToOne',
      'api::ecosystem-business.ecosystem-business'
    >;
    circuitName: Schema.Attribute.String;
    coverImage: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    embedCode: Schema.Attribute.Text & Schema.Attribute.Private;
    embedUrl: Schema.Attribute.String;
    endDate: Schema.Attribute.DateTime;
    eventDate: Schema.Attribute.DateTime;
    eventDiscipline: Schema.Attribute.Enumeration<
      [
        'derby',
        'turf',
        'exhibition',
        'championship',
        'hospitality',
        'training',
        'other',
      ]
    >;
    eventStatus: Schema.Attribute.Enumeration<
      [
        'upcoming',
        'live',
        'past',
        'hidden',
        'announced',
        'ticketsOpen',
        'soldOut',
        'completed',
        'cancelled',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'upcoming'>;
    gallery: Schema.Attribute.Media<'images' | 'videos', true>;
    heroMedia: Schema.Attribute.Media<'images' | 'videos'>;
    hospitalityInfo: Schema.Attribute.RichText;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::event.event'> &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    raceClass: Schema.Attribute.String;
    racingCategory: Schema.Attribute.String;
    schedule: Schema.Attribute.Component<'shared.event-session', true>;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    seriesName: Schema.Attribute.String;
    showOnGateway: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showOnHorseSport: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    showOnMotorsport: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'gateway'>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    sponsors: Schema.Attribute.Relation<'manyToMany', 'api::partner.partner'>;
    stableAccessInfo: Schema.Attribute.RichText;
    ticketCtaLabel: Schema.Attribute.String;
    ticketCtas: Schema.Attribute.Relation<
      'oneToMany',
      'api::ticket-cta.ticket-cta'
    >;
    ticketIntegrationType: Schema.Attribute.Enumeration<
      ['redirect', 'deepLink', 'embed']
    > &
      Schema.Attribute.DefaultTo<'redirect'>;
    ticketUrl: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    trackType: Schema.Attribute.Enumeration<
      ['turf', 'dirt', 'mixed', 'indoor', 'other']
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    venue: Schema.Attribute.String;
    venueAddress: Schema.Attribute.Text;
  };
}

export interface ApiHomepageHomepage extends Struct.SingleTypeSchema {
  collectionName: 'homepages';
  info: {
    description: 'Homepage hero, calls to action, and featured content';
    displayName: 'Homepage';
    pluralName: 'homepages';
    singularName: 'homepage';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    aboutSummaryBody: Schema.Attribute.RichText;
    aboutSummaryTitle: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featuredArticles: Schema.Attribute.Relation<
      'oneToMany',
      'api::news-article.news-article'
    >;
    featuredBusinesses: Schema.Attribute.Relation<
      'oneToMany',
      'api::ecosystem-business.ecosystem-business'
    >;
    featuredEvents: Schema.Attribute.Relation<'oneToMany', 'api::event.event'>;
    heroDescription: Schema.Attribute.RichText & Schema.Attribute.Required;
    heroEyebrow: Schema.Attribute.String & Schema.Attribute.Required;
    heroImage: Schema.Attribute.Media<'images'>;
    heroImageMobile: Schema.Attribute.Media<'images'>;
    heroTitle: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::homepage.homepage'
    > &
      Schema.Attribute.Private;
    primaryCtaLabel: Schema.Attribute.String & Schema.Attribute.Required;
    primaryCtaUrl: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    secondaryCtaLabel: Schema.Attribute.String;
    secondaryCtaUrl: Schema.Attribute.String;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiInquirySubmissionInquirySubmission
  extends Struct.CollectionTypeSchema {
  collectionName: 'inquiry_submissions';
  info: {
    description: 'Server-submitted contact inquiries';
    displayName: 'Inquiry Submission';
    pluralName: 'inquiry-submissions';
    singularName: 'inquiry-submission';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    company: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    inquiryType: Schema.Attribute.Enumeration<
      [
        'partnership',
        'sponsorship',
        'media',
        'event',
        'venue',
        'career',
        'general',
      ]
    > &
      Schema.Attribute.Required;
    internalNotes: Schema.Attribute.Text & Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::inquiry-submission.inquiry-submission'
    > &
      Schema.Attribute.Private;
    message: Schema.Attribute.Text & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sourcePage: Schema.Attribute.String;
    status: Schema.Attribute.Enumeration<['new', 'contacted', 'closed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'new'>;
    submittedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiLeadershipPersonLeadershipPerson
  extends Struct.CollectionTypeSchema {
  collectionName: 'leadership_people';
  info: {
    description: 'Leadership team members for the About page';
    displayName: 'Leadership Person';
    pluralName: 'leadership-people';
    singularName: 'leadership-person';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    group: Schema.Attribute.Enumeration<['board', 'executive', 'advisor']> &
      Schema.Attribute.DefaultTo<'executive'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::leadership-person.leadership-person'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    portrait: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.String;
    summary: Schema.Attribute.Text;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMediaGalleryMediaGallery
  extends Struct.CollectionTypeSchema {
  collectionName: 'media_galleries';
  info: {
    description: 'A gallery of images/videos, optionally tied to an event';
    displayName: 'Media Gallery';
    pluralName: 'media-galleries';
    singularName: 'media-gallery';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      [
        'race-day',
        'stable-life',
        'venue',
        'jockey',
        'hospitality',
        'press',
        'other',
      ]
    >;
    coverImage: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::media-gallery.media-gallery'
    > &
      Schema.Attribute.Private;
    mediaItems: Schema.Attribute.Media<'images' | 'videos', true>;
    publishedAt: Schema.Attribute.DateTime;
    relatedEvent: Schema.Attribute.Relation<'manyToOne', 'api::event.event'>;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'shared'>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMerchandiseItemMerchandiseItem
  extends Struct.CollectionTypeSchema {
  collectionName: 'merchandise_items';
  info: {
    description: 'Merchandise showcase teasers without internal commerce';
    displayName: 'Merchandise Item';
    pluralName: 'merchandise-items';
    singularName: 'merchandise-item';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    availabilityStatus: Schema.Attribute.Enumeration<
      ['comingSoon', 'availableExternal', 'inquiryOnly', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'comingSoon'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText;
    externalUrl: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::merchandise-item.merchandise-item'
    > &
      Schema.Attribute.Private;
    priceLabel: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'motorsport'>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportProgramMotorsportProgram
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_programs';
  info: {
    description: 'Motorsport program and campaign hubs such as IJTC and FIA Rallycross';
    displayName: 'Motorsport Program';
    pluralName: 'motorsport-programs';
    singularName: 'motorsport-program';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bannerSlides: Schema.Attribute.Component<'motorsport.campaign-slide', true>;
    becomeRidersLabel: Schema.Attribute.String;
    becomeRidersUrl: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eventEndDate: Schema.Attribute.DateTime;
    eventRules: Schema.Attribute.Component<'motorsport.rule-item', true>;
    eventStartDate: Schema.Attribute.DateTime;
    heroMedia: Schema.Attribute.Media<'images' | 'videos'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-program.motorsport-program'
    > &
      Schema.Attribute.Private;
    mainHeadline: Schema.Attribute.String;
    primaryCtaLabel: Schema.Attribute.String;
    primaryCtaUrl: Schema.Attribute.String;
    programStatus: Schema.Attribute.Enumeration<
      [
        'announced',
        'registrationOpen',
        'ticketsOpen',
        'live',
        'completed',
        'hidden',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'announced'>;
    programType: Schema.Attribute.Enumeration<
      ['juniorTalentCup', 'rallycross', 'raceWeekend', 'other']
    > &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    regulations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-regulation.motorsport-regulation'
    >;
    relatedEvents: Schema.Attribute.Relation<'manyToMany', 'api::event.event'>;
    relatedTicketCtas: Schema.Attribute.Relation<
      'manyToMany',
      'api::ticket-cta.ticket-cta'
    >;
    riders: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-rider.motorsport-rider'
    >;
    rundown: Schema.Attribute.Component<'motorsport.rundown-item', true>;
    seasonLabel: Schema.Attribute.String & Schema.Attribute.Required;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'motorsport'>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    standings: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-standing.motorsport-standing'
    >;
    summary: Schema.Attribute.RichText & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    venue: Schema.Attribute.String;
  };
}

export interface ApiMotorsportRegulationMotorsportRegulation
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_regulations';
  info: {
    description: 'Versioned program regulation documents';
    displayName: 'Motorsport Regulation';
    pluralName: 'motorsport-regulations';
    singularName: 'motorsport-regulation';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    effectiveDate: Schema.Attribute.Date & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-regulation.motorsport-regulation'
    > &
      Schema.Attribute.Private;
    pdfFile: Schema.Attribute.Media<'files'>;
    program: Schema.Attribute.Relation<
      'manyToOne',
      'api::motorsport-program.motorsport-program'
    > &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'motorsport'>;
    summary: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    version: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ApiMotorsportRiderMotorsportRider
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_riders';
  info: {
    description: 'Program-linked rider profiles';
    displayName: 'Motorsport Rider';
    pluralName: 'motorsport-riders';
    singularName: 'motorsport-rider';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    bio: Schema.Attribute.RichText;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-rider.motorsport-rider'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    nationality: Schema.Attribute.String;
    number: Schema.Attribute.String;
    portrait: Schema.Attribute.Media<'images'>;
    program: Schema.Attribute.Relation<
      'manyToOne',
      'api::motorsport-program.motorsport-program'
    > &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    region: Schema.Attribute.String;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'motorsport'>;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    team: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportStandingMotorsportStanding
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_standings';
  info: {
    description: 'Program standings, points, and result summaries';
    displayName: 'Motorsport Standing';
    pluralName: 'motorsport-standings';
    singularName: 'motorsport-standing';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-standing.motorsport-standing'
    > &
      Schema.Attribute.Private;
    points: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    position: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    program: Schema.Attribute.Relation<
      'manyToOne',
      'api::motorsport-program.motorsport-program'
    > &
      Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    resultDate: Schema.Attribute.Date;
    resultSummary: Schema.Attribute.Text;
    rider: Schema.Attribute.Relation<
      'manyToOne',
      'api::motorsport-rider.motorsport-rider'
    > &
      Schema.Attribute.Required;
    roundLabel: Schema.Attribute.String & Schema.Attribute.Required;
    seasonLabel: Schema.Attribute.String & Schema.Attribute.Required;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'motorsport'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsArticleNewsArticle extends Struct.CollectionTypeSchema {
  collectionName: 'news_articles';
  info: {
    description: 'News, publications, reports, and magazine stories';
    displayName: 'News Article';
    pluralName: 'news-articles';
    singularName: 'news-article';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    author: Schema.Attribute.String;
    body: Schema.Attribute.RichText;
    category: Schema.Attribute.Enumeration<
      [
        'news',
        'publication',
        'press-release',
        'report',
        'magazine',
        'race-report',
        'announcement',
        'lifestyle',
        'community',
        'media',
        'race-results',
        'event-announcement',
        'turf-venue',
        'stable-life',
        'jockey-story',
        'equine-performance',
        'partnership',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'news'>;
    coverImage: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    excerpt: Schema.Attribute.Text & Schema.Attribute.Required;
    featuredOnGateway: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    featuredOnHorseSport: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    featuredOnMotorsport: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    isHotTopic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::news-article.news-article'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    publishedDate: Schema.Attribute.Date & Schema.Attribute.Required;
    relatedBusinesses: Schema.Attribute.Relation<
      'manyToMany',
      'api::ecosystem-business.ecosystem-business'
    >;
    relatedEvent: Schema.Attribute.Relation<'manyToOne', 'api::event.event'>;
    relatedGallery: Schema.Attribute.Relation<
      'manyToOne',
      'api::media-gallery.media-gallery'
    >;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    showOnGateway: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showOnHorseSport: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    showOnMotorsport: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'gateway'>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiNewsletterSubscriptionNewsletterSubscription
  extends Struct.CollectionTypeSchema {
  collectionName: 'newsletter_subscriptions';
  info: {
    description: 'Server-submitted newsletter subscriptions';
    displayName: 'Newsletter Subscription';
    pluralName: 'newsletter-subscriptions';
    singularName: 'newsletter-subscription';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    consent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::newsletter-subscription.newsletter-subscription'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sourcePage: Schema.Attribute.String;
    status: Schema.Attribute.Enumeration<['active', 'unsubscribed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'active'>;
    subscribedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiPartnerPartner extends Struct.CollectionTypeSchema {
  collectionName: 'partners';
  info: {
    description: 'Sponsors and partners displayed across Sarga sites';
    displayName: 'Partner';
    pluralName: 'partners';
    singularName: 'partner';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::partner.partner'
    > &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    partnerType: Schema.Attribute.Enumeration<
      [
        'sponsor',
        'technical',
        'media',
        'broadcast',
        'government',
        'community',
        'other',
      ]
    > &
      Schema.Attribute.DefaultTo<'sponsor'>;
    publishedAt: Schema.Attribute.DateTime;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'shared'>;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    websiteUrl: Schema.Attribute.String;
  };
}

export interface ApiSitePageSitePage extends Struct.CollectionTypeSchema {
  collectionName: 'site_pages';
  info: {
    description: 'Site-scoped static and campaign page content';
    displayName: 'Site Page';
    pluralName: 'site-pages';
    singularName: 'site-page';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    heroDescription: Schema.Attribute.RichText;
    heroMedia: Schema.Attribute.Media<'images' | 'videos'>;
    heroSlides: Schema.Attribute.Component<'motorsport.hero-slide', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
        },
        number
      >;
    heroTitle: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::site-page.site-page'
    > &
      Schema.Attribute.Private;
    navigationLabel: Schema.Attribute.String;
    pageKind: Schema.Attribute.Enumeration<
      [
        'home',
        'about',
        'eventHub',
        'campaign',
        'merchandise',
        'legal',
        'custom',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'custom'>;
    publishedAt: Schema.Attribute.DateTime;
    routePath: Schema.Attribute.String & Schema.Attribute.Required;
    sections: Schema.Attribute.DynamicZone<['shared.page-section']>;
    seo: Schema.Attribute.Component<'shared.seo', false>;
    site: Schema.Attribute.Relation<'manyToOne', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'gateway'>;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiSiteSite extends Struct.CollectionTypeSchema {
  collectionName: 'sites';
  info: {
    description: 'A public frontend in the Sarga multisite (gateway, motorsport, future sites)';
    displayName: 'Site';
    pluralName: 'sites';
    singularName: 'site';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    baseUrl: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    favicon: Schema.Attribute.Media<'images'>;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::site.site'> &
      Schema.Attribute.Private;
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    themeKey: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiTicketCtaTicketCta extends Struct.CollectionTypeSchema {
  collectionName: 'ticket_ctas';
  info: {
    description: 'Centralized partner ticket call-to-action (redirect / deep link / configurable embed). No internal payment.';
    displayName: 'Ticket CTA';
    pluralName: 'ticket-ctas';
    singularName: 'ticket-cta';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    activeFrom: Schema.Attribute.DateTime;
    activeUntil: Schema.Attribute.DateTime;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaType: Schema.Attribute.Enumeration<['redirect', 'deepLink', 'embed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'redirect'>;
    embedCode: Schema.Attribute.Text & Schema.Attribute.Private;
    embedConfigJson: Schema.Attribute.JSON;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::ticket-cta.ticket-cta'
    > &
      Schema.Attribute.Private;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    relatedEvent: Schema.Attribute.Relation<'manyToOne', 'api::event.event'>;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'shared'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    trackingParams: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String;
  };
}

export interface ApiTimelineItemTimelineItem
  extends Struct.CollectionTypeSchema {
  collectionName: 'timeline_items';
  info: {
    description: 'Corporate timeline entries for the About page';
    displayName: 'Timeline Item';
    pluralName: 'timeline-items';
    singularName: 'timeline-item';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::timeline-item.timeline-item'
    > &
      Schema.Attribute.Private;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    focalPoint: Schema.Attribute.JSON;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.Text;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.Text & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::session': AdminSession;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::ecosystem-business.ecosystem-business': ApiEcosystemBusinessEcosystemBusiness;
      'api::event.event': ApiEventEvent;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::inquiry-submission.inquiry-submission': ApiInquirySubmissionInquirySubmission;
      'api::leadership-person.leadership-person': ApiLeadershipPersonLeadershipPerson;
      'api::media-gallery.media-gallery': ApiMediaGalleryMediaGallery;
      'api::merchandise-item.merchandise-item': ApiMerchandiseItemMerchandiseItem;
      'api::motorsport-program.motorsport-program': ApiMotorsportProgramMotorsportProgram;
      'api::motorsport-regulation.motorsport-regulation': ApiMotorsportRegulationMotorsportRegulation;
      'api::motorsport-rider.motorsport-rider': ApiMotorsportRiderMotorsportRider;
      'api::motorsport-standing.motorsport-standing': ApiMotorsportStandingMotorsportStanding;
      'api::news-article.news-article': ApiNewsArticleNewsArticle;
      'api::newsletter-subscription.newsletter-subscription': ApiNewsletterSubscriptionNewsletterSubscription;
      'api::partner.partner': ApiPartnerPartner;
      'api::site-page.site-page': ApiSitePageSitePage;
      'api::site.site': ApiSiteSite;
      'api::ticket-cta.ticket-cta': ApiTicketCtaTicketCta;
      'api::timeline-item.timeline-item': ApiTimelineItemTimelineItem;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
