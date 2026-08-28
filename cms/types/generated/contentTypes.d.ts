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

export interface ApiCorporateReportCorporateReport
  extends Struct.CollectionTypeSchema {
  collectionName: 'corporate_reports';
  info: {
    description: 'Approved annual and sustainability report library entries';
    displayName: 'Corporate Report';
    pluralName: 'corporate-reports';
    singularName: 'corporate-report';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    coverImage: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    externalUrl: Schema.Attribute.String;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::corporate-report.corporate-report'
    >;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publicationStatus: Schema.Attribute.Enumeration<
      ['published', 'forthcoming', 'archived']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'forthcoming'>;
    publishedAt: Schema.Attribute.DateTime;
    publishedDate: Schema.Attribute.Date;
    reportFile: Schema.Attribute.Media<'files'>;
    reportType: Schema.Attribute.Enumeration<['annual', 'sustainability']> &
      Schema.Attribute.Required;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['gateway', 'shared', 'hidden']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'gateway'>;
    slug: Schema.Attribute.UID<'title'> &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.Integer & Schema.Attribute.Required;
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
  pluginOptions: {
    i18n: {
      localized: true;
    };
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
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.DefaultTo<'Find Out More'>;
    ctaUrl: Schema.Attribute.String;
    dedicatedSiteKey: Schema.Attribute.Enumeration<
      ['none', 'motorsport', 'horsesport']
    > &
      Schema.Attribute.DefaultTo<'none'>;
    dedicatedSiteUrl: Schema.Attribute.String;
    gallery: Schema.Attribute.Media<'images' | 'videos', true>;
    heroImage: Schema.Attribute.Media<'images'>;
    highlights: Schema.Attribute.Component<'shared.key-highlight', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    launchTarget: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::ecosystem-business.ecosystem-business'
    >;
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    overview: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    shortDescription: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    broadcastUrl: Schema.Attribute.String;
    business: Schema.Attribute.Relation<
      'manyToOne',
      'api::ecosystem-business.ecosystem-business'
    >;
    circuitName: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    coverImage: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    hospitalityInfo: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<'oneToMany', 'api::event.event'>;
    motorsportPresentation: Schema.Attribute.Component<
      'motorsport.detail-presentation',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    raceClass: Schema.Attribute.String;
    racingCategory: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    schedule: Schema.Attribute.Component<'shared.event-session', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seriesName: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    stableAccessInfo: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ticketCtaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ticketCtas: Schema.Attribute.Relation<
      'oneToMany',
      'api::ticket-cta.ticket-cta'
    >;
    ticketIntegrationType: Schema.Attribute.Enumeration<
      ['redirect', 'deepLink', 'embed']
    > &
      Schema.Attribute.DefaultTo<'redirect'>;
    ticketUrl: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    trackType: Schema.Attribute.Enumeration<
      ['turf', 'dirt', 'mixed', 'indoor', 'other']
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    venue: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    venueAddress: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    aboutSummaryBody: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    aboutSummaryTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    heroDescription: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    heroEyebrow: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    heroImage: Schema.Attribute.Media<'images'>;
    heroImageMobile: Schema.Attribute.Media<'images'>;
    heroTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    heroVideo: Schema.Attribute.Component<'shared.hero-video', false>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::homepage.homepage'
    >;
    primaryCtaLabel: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    primaryCtaUrl: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    secondaryCtaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    secondaryCtaUrl: Schema.Attribute.String;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
        'ticketing',
        'stable',
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
    notificationAttempts: Schema.Attribute.Integer &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    notificationLastAttemptAt: Schema.Attribute.DateTime &
      Schema.Attribute.Private;
    notificationLastErrorCode: Schema.Attribute.String &
      Schema.Attribute.Private;
    notificationNextAttemptAt: Schema.Attribute.DateTime &
      Schema.Attribute.Private;
    notificationSentAt: Schema.Attribute.DateTime & Schema.Attribute.Private;
    notificationStatus: Schema.Attribute.Enumeration<
      ['disabled', 'pending', 'processing', 'sent', 'failed']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'disabled'>;
    phone: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    sourceLocale: Schema.Attribute.Enumeration<['en', 'id']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'en'>;
    sourcePage: Schema.Attribute.String;
    sourceSite: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'gateway'>;
    status: Schema.Attribute.Enumeration<['new', 'contacted', 'closed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'new'>;
    submittedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiJobVacancyJobVacancy extends Struct.CollectionTypeSchema {
  collectionName: 'job_vacancies';
  info: {
    description: 'Gateway careers vacancies with approved LinkedIn application links';
    displayName: 'Job Vacancy';
    pluralName: 'job-vacancies';
    singularName: 'job-vacancy';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    applicationUrl: Schema.Attribute.String;
    closingDate: Schema.Attribute.Date;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    discipline: Schema.Attribute.Enumeration<
      [
        'sport-operations',
        'venue-experience',
        'media-creative',
        'technology-group',
      ]
    > &
      Schema.Attribute.Required;
    employmentType: Schema.Attribute.Enumeration<
      ['full-time', 'part-time', 'contract', 'internship']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'full-time'>;
    featured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::job-vacancy.job-vacancy'
    >;
    location: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    postedDate: Schema.Attribute.Date & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    requirements: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    responsibilities: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seniority: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['gateway', 'shared', 'hidden']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'gateway'>;
    slug: Schema.Attribute.UID<'title'> &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    summary: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    vacancyStatus: Schema.Attribute.Enumeration<['open', 'closed', 'filled']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'open'>;
    workMode: Schema.Attribute.Enumeration<['onsite', 'hybrid', 'remote']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'onsite'>;
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
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    group: Schema.Attribute.Enumeration<['board', 'executive', 'advisor']> &
      Schema.Attribute.DefaultTo<'executive'>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::leadership-person.leadership-person'
    >;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    portrait: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    site: Schema.Attribute.Relation<'manyToOne', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.DefaultTo<'shared'>;
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
  pluginOptions: {
    i18n: {
      localized: true;
    };
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
        'circuit',
        'two-wheels',
        'mixed-surface',
        'other',
      ]
    >;
    coverImage: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::media-gallery.media-gallery'
    >;
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
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
  pluginOptions: {
    i18n: {
      localized: true;
    };
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
    description: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    externalUrl: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::merchandise-item.merchandise-item'
    >;
    priceLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    sites: Schema.Attribute.Relation<'manyToMany', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'motorsport'>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportAboutPageMotorsportAboutPage
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-about-page';
  info: {
    displayName: 'Motorsport About Page';
    pluralName: 'motorsport-about-pages';
    singularName: 'motorsport-about-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    capabilities: Schema.Attribute.Component<
      'motorsport.about-capabilities',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    contactCtaSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ecosystemCtaSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero: Schema.Attribute.Component<'motorsport.page-hero', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    informationBand: Schema.Attribute.Component<
      'motorsport.page-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-about-page.motorsport-about-page'
    >;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    profileSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    routeAliases: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<[]>;
    routePath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'/about'>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'motorsport'>;
    teamSection: Schema.Attribute.Component<'motorsport.page-section', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportContactPageMotorsportContactPage
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-contact-page';
  info: {
    displayName: 'Motorsport Contact Page';
    pluralName: 'motorsport-contact-pages';
    singularName: 'motorsport-contact-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    finalCtaSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero: Schema.Attribute.Component<'motorsport.page-hero', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    informationBand: Schema.Attribute.Component<
      'motorsport.page-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    inquiryControlSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    inquiryFormSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-contact-page.motorsport-contact-page'
    >;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    routeAliases: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<[]>;
    routePath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'/contact'>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'motorsport'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportEventMotorsportEvent
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_events';
  info: {
    description: 'Motorsport-owned events, schedules, partners, and ticket destinations';
    displayName: 'Motorsport Event';
    pluralName: 'motorsport-events';
    singularName: 'motorsport-event';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    broadcastUrl: Schema.Attribute.String;
    business: Schema.Attribute.Relation<
      'manyToOne',
      'api::ecosystem-business.ecosystem-business'
    >;
    circuitName: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    coverImage: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    embedCode: Schema.Attribute.Text & Schema.Attribute.Private;
    embedUrl: Schema.Attribute.String;
    endDate: Schema.Attribute.DateTime;
    eventDate: Schema.Attribute.DateTime;
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
    legacySourceDocumentId: Schema.Attribute.String & Schema.Attribute.Private;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-event.motorsport-event'
    >;
    motorsportPresentation: Schema.Attribute.Component<
      'motorsport.detail-presentation',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    racingCategory: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    schedule: Schema.Attribute.Component<'shared.event-session', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seriesName: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    sponsors: Schema.Attribute.Relation<
      'manyToMany',
      'api::motorsport-partner.motorsport-partner'
    >;
    ticketCtaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ticketCtas: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-ticket-cta.motorsport-ticket-cta'
    >;
    ticketIntegrationType: Schema.Attribute.Enumeration<
      ['redirect', 'deepLink', 'embed']
    > &
      Schema.Attribute.DefaultTo<'redirect'>;
    ticketUrl: Schema.Attribute.String;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    venue: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    venueAddress: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ApiMotorsportEventsPageMotorsportEventsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-events-page';
  info: {
    displayName: 'Motorsport Events Page';
    pluralName: 'motorsport-events-pages';
    singularName: 'motorsport-events-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    calendarSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eventControlSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero: Schema.Attribute.Component<'motorsport.page-hero', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    informationBand: Schema.Attribute.Component<
      'motorsport.page-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-events-page.motorsport-events-page'
    >;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    programmesSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    routeAliases: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<[]>;
    routePath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'/events'>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'motorsport'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportExperiencePageMotorsportExperiencePage
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-experience-page';
  info: {
    displayName: 'Motorsport Experience Page';
    pluralName: 'motorsport-experience-pages';
    singularName: 'motorsport-experience-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    experienceControlSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    finalCtaSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero: Schema.Attribute.Component<'motorsport.page-hero', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    informationBand: Schema.Attribute.Component<
      'motorsport.page-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-experience-page.motorsport-experience-page'
    >;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pillarsSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    routeAliases: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<[]>;
    routePath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'/experience'>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'motorsport'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    trackSection: Schema.Attribute.Component<'motorsport.page-section', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportGalleryPageMotorsportGalleryPage
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-gallery-page';
  info: {
    displayName: 'Motorsport Gallery Page';
    pluralName: 'motorsport-gallery-pages';
    singularName: 'motorsport-gallery-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    archiveSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    hero: Schema.Attribute.Component<'motorsport.page-hero', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    informationBand: Schema.Attribute.Component<
      'motorsport.page-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-gallery-page.motorsport-gallery-page'
    >;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    routeAliases: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<[]>;
    routePath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'/gallery'>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'motorsport'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportHomePageMotorsportHomePage
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-home-page';
  info: {
    displayName: 'Motorsport Home Page';
    pluralName: 'motorsport-home-pages';
    singularName: 'motorsport-home-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    connectedRecordsSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featuredEvent: Schema.Attribute.Relation<
      'manyToOne',
      'api::motorsport-event.motorsport-event'
    >;
    featuredProgram: Schema.Attribute.Relation<
      'manyToOne',
      'api::motorsport-program.motorsport-program'
    >;
    gallerySection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero: Schema.Attribute.Component<'motorsport.page-hero', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    heroSlides: Schema.Attribute.Component<'motorsport.hero-slide', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
        },
        number
      >;
    informationBand: Schema.Attribute.Component<
      'motorsport.page-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    latestNewsSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-home-page.motorsport-home-page'
    >;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    newsletterSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    partnersSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    routeAliases: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<[]>;
    routePath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'/'>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    showPartnersOnHomepage: Schema.Attribute.Boolean &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<true>;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'motorsport'>;
    ticketSection: Schema.Attribute.Component<
      'motorsport.home-ticket-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    upcomingEventsSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    worldSection: Schema.Attribute.Component<
      'motorsport.world-of-motorsport',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface ApiMotorsportLeadershipPersonMotorsportLeadershipPerson
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_leadership_people';
  info: {
    description: 'Motorsport leadership team members for the About page';
    displayName: 'Motorsport Leadership Person';
    pluralName: 'motorsport-leadership-people';
    singularName: 'motorsport-leadership-person';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    group: Schema.Attribute.Enumeration<['board', 'executive', 'advisor']> &
      Schema.Attribute.DefaultTo<'executive'>;
    legacySourceDocumentId: Schema.Attribute.String & Schema.Attribute.Private;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-leadership-person.motorsport-leadership-person'
    >;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    portrait: Schema.Attribute.Media<'images'>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    site: Schema.Attribute.Relation<'manyToOne', 'api::site.site'>;
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportMerchandiseItemMotorsportMerchandiseItem
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_merchandise_items';
  info: {
    description: 'Motorsport merchandise showcase teasers without internal commerce';
    displayName: 'Motorsport Merchandise Item';
    pluralName: 'motorsport-merchandise-items';
    singularName: 'motorsport-merchandise-item';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
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
    description: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    externalUrl: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    legacySourceDocumentId: Schema.Attribute.String & Schema.Attribute.Private;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-merchandise-item.motorsport-merchandise-item'
    >;
    priceLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportMerchandisePageMotorsportMerchandisePage
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-merchandise-page';
  info: {
    displayName: 'Motorsport Merchandise Page';
    pluralName: 'motorsport-merchandise-pages';
    singularName: 'motorsport-merchandise-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    catalogueSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    finalCtaSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero: Schema.Attribute.Component<'motorsport.page-hero', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    informationBand: Schema.Attribute.Component<
      'motorsport.page-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-merchandise-page.motorsport-merchandise-page'
    >;
    merchControlSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    routeAliases: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<[]>;
    routePath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'/merchandise'>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'motorsport'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportNewsArticleMotorsportNewsArticle
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_news_articles';
  info: {
    description: 'Motorsport-owned news, publications, reports, and magazine stories';
    displayName: 'Motorsport News Article';
    pluralName: 'motorsport-news-articles';
    singularName: 'motorsport-news-article';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    author: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    body: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
        'partnership',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'news'>;
    coverImage: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    excerpt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    isHotTopic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    legacySourceDocumentId: Schema.Attribute.String & Schema.Attribute.Private;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-news-article.motorsport-news-article'
    >;
    motorsportPresentation: Schema.Attribute.Component<
      'motorsport.detail-presentation',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    publishedDate: Schema.Attribute.Date & Schema.Attribute.Required;
    relatedBusinesses: Schema.Attribute.Relation<
      'manyToMany',
      'api::ecosystem-business.ecosystem-business'
    >;
    relatedEvent: Schema.Attribute.Relation<
      'manyToOne',
      'api::motorsport-event.motorsport-event'
    >;
    relatedGallery: Schema.Attribute.Relation<
      'manyToOne',
      'api::media-gallery.media-gallery'
    >;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Schema.Attribute.UID<'title'> & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportNewsPageMotorsportNewsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-news-page';
  info: {
    displayName: 'Motorsport News Page';
    pluralName: 'motorsport-news-pages';
    singularName: 'motorsport-news-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    archiveIntroSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    galleryCtaSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero: Schema.Attribute.Component<'motorsport.page-hero', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    informationBand: Schema.Attribute.Component<
      'motorsport.page-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    leadStorySection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-news-page.motorsport-news-page'
    >;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    newsControlSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    routeAliases: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<[]>;
    routePath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'/news'>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'motorsport'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportPartnerMotorsportPartner
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_partners';
  info: {
    description: 'Motorsport sponsors and partners displayed across Motorsport routes';
    displayName: 'Motorsport Partner';
    pluralName: 'motorsport-partners';
    singularName: 'motorsport-partner';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    legacySourceDocumentId: Schema.Attribute.String & Schema.Attribute.Private;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-partner.motorsport-partner'
    >;
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    slug: Schema.Attribute.UID<'name'> & Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    websiteUrl: Schema.Attribute.String;
  };
}

export interface ApiMotorsportPartnersPageMotorsportPartnersPage
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-partners-page';
  info: {
    displayName: 'Motorsport Partners Page';
    pluralName: 'motorsport-partners-pages';
    singularName: 'motorsport-partners-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    finalCtaSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero: Schema.Attribute.Component<'motorsport.page-hero', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    informationBand: Schema.Attribute.Component<
      'motorsport.page-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-partners-page.motorsport-partners-page'
    >;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    partnerControlSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    partnerNetworkSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    routeAliases: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<[]>;
    routePath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'/partners'>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'motorsport'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportProgramMotorsportProgram
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_programs';
  info: {
    description: 'Motorsport program and campaign hubs such as IJTC and FIA Rallycross. The FIA Rallycross event detail URL is managed by the program with slug fia-rallycross-world-cup-indonesia-2026.';
    displayName: 'Motorsport Program';
    pluralName: 'motorsport-programs';
    singularName: 'motorsport-program';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    bannerSlides: Schema.Attribute.Component<
      'motorsport.campaign-slide',
      true
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    becomeRidersLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    becomeRidersUrl: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    eventEndDate: Schema.Attribute.DateTime;
    eventMenuEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    eventMenuLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    eventRules: Schema.Attribute.Component<'motorsport.rule-item', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    eventStartDate: Schema.Attribute.DateTime;
    heroMedia: Schema.Attribute.Media<'images' | 'videos'>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-program.motorsport-program'
    >;
    mainHeadline: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    motorsportPresentation: Schema.Attribute.Component<
      'motorsport.detail-presentation',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    presentationSections: Schema.Attribute.Component<
      'motorsport.page-section',
      true
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    primaryCtaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    relatedEvents: Schema.Attribute.Relation<
      'manyToMany',
      'api::motorsport-event.motorsport-event'
    >;
    relatedTicketCtas: Schema.Attribute.Relation<
      'manyToMany',
      'api::ticket-cta.ticket-cta'
    >;
    riders: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-rider.motorsport-rider'
    >;
    rundown: Schema.Attribute.Component<'motorsport.rundown-item', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seasonLabel: Schema.Attribute.String & Schema.Attribute.Required;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    summary: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    effectiveDate: Schema.Attribute.Date & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-regulation.motorsport-regulation'
    >;
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
    summary: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    bio: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-rider.motorsport-rider'
    >;
    motorsportPresentation: Schema.Attribute.Component<
      'motorsport.detail-presentation',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    region: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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

export interface ApiMotorsportThemeSettingsMotorsportThemeSettings
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-theme-settings';
  info: {
    description: 'Allowlisted visual theme preset for the Motorsport website.';
    displayName: 'Motorsport Theme Settings';
    pluralName: 'motorsport-theme-settings-configs';
    singularName: 'motorsport-theme-settings';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-theme-settings.motorsport-theme-settings'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'motorsport'>;
    themePreset: Schema.Attribute.Enumeration<
      ['current-motorsport', 'vendor-editorial', 'vendor-night']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'current-motorsport'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'Motorsport Theme Settings'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportTicketCtaMotorsportTicketCta
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_ticket_ctas';
  info: {
    description: 'Motorsport partner ticket redirects, deep links, and approved embeds. No internal payment.';
    displayName: 'Motorsport Ticket CTA';
    pluralName: 'motorsport-ticket-ctas';
    singularName: 'motorsport-ticket-cta';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    activeFrom: Schema.Attribute.DateTime;
    activeUntil: Schema.Attribute.DateTime;
    backgroundImage: Schema.Attribute.Media<'images'>;
    backgroundImageMobile: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ctaType: Schema.Attribute.Enumeration<['redirect', 'deepLink', 'embed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'redirect'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    embedCode: Schema.Attribute.Text & Schema.Attribute.Private;
    embedConfigJson: Schema.Attribute.JSON;
    eventLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    eventText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    footerText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'>;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    legacySourceDocumentId: Schema.Attribute.String & Schema.Attribute.Private;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-ticket-cta.motorsport-ticket-cta'
    >;
    partnerLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    provider: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    providerLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    providerText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    relatedEvent: Schema.Attribute.Relation<
      'manyToOne',
      'api::motorsport-event.motorsport-event'
    >;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    trackingParams: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String;
  };
}

export interface ApiMotorsportTicketsPageMotorsportTicketsPage
  extends Struct.SingleTypeSchema {
  collectionName: 'motorsport-tickets-page';
  info: {
    displayName: 'Motorsport Tickets Page';
    pluralName: 'motorsport-tickets-pages';
    singularName: 'motorsport-tickets-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    featuredTicketSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    hero: Schema.Attribute.Component<'motorsport.page-hero', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    informationBand: Schema.Attribute.Component<
      'motorsport.page-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-tickets-page.motorsport-tickets-page'
    >;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    publishedAt: Schema.Attribute.DateTime;
    routeAliases: Schema.Attribute.JSON &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<[]>;
    routePath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }> &
      Schema.Attribute.DefaultTo<'/tickets'>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    siteScope: Schema.Attribute.Enumeration<['motorsport']> &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<'motorsport'>;
    ticketControlSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ticketedEventsSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ticketInfoSection: Schema.Attribute.Component<
      'motorsport.page-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiMotorsportTopNavigationItemMotorsportTopNavigationItem
  extends Struct.CollectionTypeSchema {
  collectionName: 'motorsport_top_navigation_items';
  info: {
    description: 'Motorsport-only bilingual primary navigation configuration';
    displayName: 'Motorsport Top Navigation Item';
    pluralName: 'motorsport-top-navigation-items';
    singularName: 'motorsport-top-navigation-item';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    ariaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 1000;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    emphasis: Schema.Attribute.Enumeration<['default', 'primaryCta']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'default'>;
    enabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    href: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    internalName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
        minLength: 2;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    legacySourceDocumentId: Schema.Attribute.String & Schema.Attribute.Private;
    linkType: Schema.Attribute.Enumeration<
      ['internal', 'crossSite', 'external']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'internal'>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::motorsport-top-navigation-item.motorsport-top-navigation-item'
    >;
    openInNewTab: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    publishedAt: Schema.Attribute.DateTime;
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
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    author: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    body: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    excerpt: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    featuredOnGateway: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    featuredOnHorseSport: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    featuredOnMotorsport: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    isHotTopic: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::news-article.news-article'
    >;
    motorsportPresentation: Schema.Attribute.Component<
      'motorsport.detail-presentation',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    sourceLocale: Schema.Attribute.Enumeration<['en', 'id']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'en'>;
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
    description: 'Site-scoped page content. Use pageKind to select the page family; optional homepage fields are not required on About, News, Campaign, or Custom pages.';
    displayName: 'Site Page';
    pluralName: 'site-pages';
    singularName: 'site-page';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    heroDescription: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    heroEnabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    heroMedia: Schema.Attribute.Media<'images' | 'videos'>;
    heroSlides: Schema.Attribute.Component<'motorsport.hero-slide', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
        },
        number
      >;
    heroTitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    heroVideo: Schema.Attribute.Component<'shared.hero-video', false>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::site-page.site-page'
    >;
    motorsportFeaturedEvent: Schema.Attribute.Relation<
      'manyToOne',
      'api::event.event'
    >;
    motorsportInformationBand: Schema.Attribute.Component<
      'motorsport.home-information-band',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    motorsportTicketSection: Schema.Attribute.Component<
      'motorsport.home-ticket-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    motorsportWorldSection: Schema.Attribute.Component<
      'motorsport.world-of-motorsport',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    navigationLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageAvailability: Schema.Attribute.Component<
      'shared.page-availability',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    pageKind: Schema.Attribute.Enumeration<
      [
        'home',
        'about',
        'eventHub',
        'newsHub',
        'campaign',
        'merchandise',
        'history',
        'reportIndex',
        'legal',
        'custom',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'custom'>;
    publishedAt: Schema.Attribute.DateTime;
    routePath: Schema.Attribute.String & Schema.Attribute.Required;
    sections: Schema.Attribute.DynamicZone<
      ['shared.page-section', 'motorsport.about-capabilities']
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    seo: Schema.Attribute.Component<'shared.seo', false> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    site: Schema.Attribute.Relation<'manyToOne', 'api::site.site'>;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport', 'shared', 'hidden']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'gateway'>;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
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
    footerColumns: Schema.Attribute.Component<'shared.footer-column', true>;
    footerCopyright: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    footerLogo: Schema.Attribute.Media<'images'>;
    footerSocialLinks: Schema.Attribute.Component<'shared.footer-link', true>;
    footerStatement: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 240;
      }>;
    footerUtilityLinks: Schema.Attribute.Component<'shared.footer-link', true>;
    headerLogo: Schema.Attribute.Media<'images'>;
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
    backgroundImage: Schema.Attribute.Media<'images'>;
    backgroundImageMobile: Schema.Attribute.Media<'images'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ctaLabel: Schema.Attribute.String;
    ctaType: Schema.Attribute.Enumeration<['redirect', 'deepLink', 'embed']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'redirect'>;
    description: Schema.Attribute.Text;
    embedCode: Schema.Attribute.Text & Schema.Attribute.Private;
    embedConfigJson: Schema.Attribute.JSON;
    eventLabel: Schema.Attribute.String;
    eventText: Schema.Attribute.String;
    eyebrow: Schema.Attribute.String;
    footerText: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::ticket-cta.ticket-cta'
    > &
      Schema.Attribute.Private;
    partnerLabel: Schema.Attribute.String;
    provider: Schema.Attribute.String;
    providerLabel: Schema.Attribute.String;
    providerText: Schema.Attribute.String;
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
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    image: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::timeline-item.timeline-item'
    >;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    publishedAt: Schema.Attribute.DateTime;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    year: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ApiTopNavigationItemTopNavigationItem
  extends Struct.CollectionTypeSchema {
  collectionName: 'top_navigation_items';
  info: {
    description: 'Site-scoped bilingual primary navigation configuration';
    displayName: 'Top Navigation Item';
    pluralName: 'top-navigation-items';
    singularName: 'top-navigation-item';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    i18n: {
      localized: true;
    };
  };
  attributes: {
    ariaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 1000;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    emphasis: Schema.Attribute.Enumeration<['default', 'primaryCta']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'default'>;
    enabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    href: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    internalName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
        minLength: 2;
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    linkType: Schema.Attribute.Enumeration<
      ['internal', 'crossSite', 'external']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'internal'>;
    locale: Schema.Attribute.String;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::top-navigation-item.top-navigation-item'
    >;
    openInNewTab: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    publishedAt: Schema.Attribute.DateTime;
    siteScope: Schema.Attribute.Enumeration<
      ['gateway', 'motorsport', 'horsesport']
    > &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
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
      'api::corporate-report.corporate-report': ApiCorporateReportCorporateReport;
      'api::ecosystem-business.ecosystem-business': ApiEcosystemBusinessEcosystemBusiness;
      'api::event.event': ApiEventEvent;
      'api::homepage.homepage': ApiHomepageHomepage;
      'api::inquiry-submission.inquiry-submission': ApiInquirySubmissionInquirySubmission;
      'api::job-vacancy.job-vacancy': ApiJobVacancyJobVacancy;
      'api::leadership-person.leadership-person': ApiLeadershipPersonLeadershipPerson;
      'api::media-gallery.media-gallery': ApiMediaGalleryMediaGallery;
      'api::merchandise-item.merchandise-item': ApiMerchandiseItemMerchandiseItem;
      'api::motorsport-about-page.motorsport-about-page': ApiMotorsportAboutPageMotorsportAboutPage;
      'api::motorsport-contact-page.motorsport-contact-page': ApiMotorsportContactPageMotorsportContactPage;
      'api::motorsport-event.motorsport-event': ApiMotorsportEventMotorsportEvent;
      'api::motorsport-events-page.motorsport-events-page': ApiMotorsportEventsPageMotorsportEventsPage;
      'api::motorsport-experience-page.motorsport-experience-page': ApiMotorsportExperiencePageMotorsportExperiencePage;
      'api::motorsport-gallery-page.motorsport-gallery-page': ApiMotorsportGalleryPageMotorsportGalleryPage;
      'api::motorsport-home-page.motorsport-home-page': ApiMotorsportHomePageMotorsportHomePage;
      'api::motorsport-leadership-person.motorsport-leadership-person': ApiMotorsportLeadershipPersonMotorsportLeadershipPerson;
      'api::motorsport-merchandise-item.motorsport-merchandise-item': ApiMotorsportMerchandiseItemMotorsportMerchandiseItem;
      'api::motorsport-merchandise-page.motorsport-merchandise-page': ApiMotorsportMerchandisePageMotorsportMerchandisePage;
      'api::motorsport-news-article.motorsport-news-article': ApiMotorsportNewsArticleMotorsportNewsArticle;
      'api::motorsport-news-page.motorsport-news-page': ApiMotorsportNewsPageMotorsportNewsPage;
      'api::motorsport-partner.motorsport-partner': ApiMotorsportPartnerMotorsportPartner;
      'api::motorsport-partners-page.motorsport-partners-page': ApiMotorsportPartnersPageMotorsportPartnersPage;
      'api::motorsport-program.motorsport-program': ApiMotorsportProgramMotorsportProgram;
      'api::motorsport-regulation.motorsport-regulation': ApiMotorsportRegulationMotorsportRegulation;
      'api::motorsport-rider.motorsport-rider': ApiMotorsportRiderMotorsportRider;
      'api::motorsport-standing.motorsport-standing': ApiMotorsportStandingMotorsportStanding;
      'api::motorsport-theme-settings.motorsport-theme-settings': ApiMotorsportThemeSettingsMotorsportThemeSettings;
      'api::motorsport-ticket-cta.motorsport-ticket-cta': ApiMotorsportTicketCtaMotorsportTicketCta;
      'api::motorsport-tickets-page.motorsport-tickets-page': ApiMotorsportTicketsPageMotorsportTicketsPage;
      'api::motorsport-top-navigation-item.motorsport-top-navigation-item': ApiMotorsportTopNavigationItemMotorsportTopNavigationItem;
      'api::news-article.news-article': ApiNewsArticleNewsArticle;
      'api::newsletter-subscription.newsletter-subscription': ApiNewsletterSubscriptionNewsletterSubscription;
      'api::partner.partner': ApiPartnerPartner;
      'api::site-page.site-page': ApiSitePageSitePage;
      'api::site.site': ApiSiteSite;
      'api::ticket-cta.ticket-cta': ApiTicketCtaTicketCta;
      'api::timeline-item.timeline-item': ApiTimelineItemTimelineItem;
      'api::top-navigation-item.top-navigation-item': ApiTopNavigationItemTopNavigationItem;
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
