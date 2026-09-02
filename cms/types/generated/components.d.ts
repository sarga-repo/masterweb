import type { Schema, Struct } from '@strapi/strapi';

export interface MotorsportAboutCapabilities extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_about_capabilities';
  info: {
    description: 'CMS-managed capability grid for the Motorsport About page';
    displayName: 'About Capabilities';
  };
  attributes: {
    cards: Schema.Attribute.Component<
      'motorsport.about-capability-card',
      true
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 320;
      }>;
    enabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    indexLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    showDescription: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showEyebrow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showTitle: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface MotorsportAboutCapabilityCard extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_about_capability_cards';
  info: {
    description: 'Ordered, site-owned capability card for the Motorsport About page';
    displayName: 'About Capability Card';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['crimson', 'orange', 'yellow', 'teal', 'blue']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'crimson'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 320;
      }>;
    enabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    indexLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    internalName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    sortOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
  };
}

export interface MotorsportCampaignSlide extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_campaign_slides';
  info: {
    description: '02 \u2014 One item in the campaign carousel. This is separate from supporting presentation sections.';
    displayName: 'Campaign Carousel Slide';
  };
  attributes: {
    ctaLabel: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    mobileImage: Schema.Attribute.Media<'images'>;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MotorsportDetailPresentation extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_detail_presentations';
  info: {
    description: '01 \u2014 The first presentation group in a Motorsport Program. Edit Hero first, then Information Band. This component is also reused by event/news detail records.';
    displayName: 'Motorsport Presentation \u2014 Hero & Information Band';
  };
  attributes: {
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
    routeKey: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface MotorsportDisciplineCard extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_discipline_cards';
  info: {
    description: 'Ordered homepage racing-format card with managed media and destination';
    displayName: 'Motorsport Discipline Card';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['crimson', 'orange', 'yellow', 'teal', 'blue']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'crimson'>;
    enabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    href: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'/events'>;
    image: Schema.Attribute.Media<'images'>;
    imageAlt: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    internalName: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    shortLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    sortOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
  };
}

export interface MotorsportFiaRallycrossContent extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_fia_rallycross_contents';
  info: {
    description: 'One logical editor group for FIA Rallycross Format, Rundown, and Race-day Guide content. Use only for Rallycross programmes.';
    displayName: 'FIA Rallycross Content';
  };
  attributes: {
    formatSection: Schema.Attribute.Component<
      'motorsport.fia-rallycross-format-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    raceDayGuideSection: Schema.Attribute.Component<
      'motorsport.fia-rallycross-race-day-guide-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    rundownSection: Schema.Attribute.Component<
      'motorsport.fia-rallycross-rundown-section',
      false
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface MotorsportFiaRallycrossFormatItem
  extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_fia_rallycross_format_items';
  info: {
    description: 'One format card shown in the FIA Rallycross Format section. Use a short label, title, explanation, and approved accent colour.';
    displayName: 'FIA Rallycross Format Item';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['crimson', 'orange', 'yellow', 'teal', 'blue']
    > &
      Schema.Attribute.DefaultTo<'crimson'>;
    description: Schema.Attribute.Text;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface MotorsportFiaRallycrossFormatSection
  extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_fia_rallycross_format_sections';
  info: {
    description: 'Presentation copy and ordered format cards for the FIA Rallycross Format section.';
    displayName: 'FIA Rallycross Format Section';
  };
  attributes: {
    body: Schema.Attribute.RichText &
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
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    formatItems: Schema.Attribute.Component<
      'motorsport.fia-rallycross-format-item',
      true
    > &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    indexLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showBody: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showEyebrow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showTitle: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface MotorsportFiaRallycrossRaceDayGuideSection
  extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_fia_rallycross_race_day_guide_sections';
  info: {
    description: 'Presentation copy and Do/Do not guidance for the FIA Rallycross Race-day Guide section.';
    displayName: 'FIA Rallycross Race-day Guide Section';
  };
  attributes: {
    body: Schema.Attribute.RichText &
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
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    indexLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ruleItems: Schema.Attribute.Component<'motorsport.rule-item', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    showBody: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showEyebrow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showTitle: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface MotorsportFiaRallycrossRundownSection
  extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_fia_rallycross_rundown_sections';
  info: {
    description: 'Presentation copy and schedule items for the FIA Rallycross Rundown section.';
    displayName: 'FIA Rallycross Rundown Section';
  };
  attributes: {
    body: Schema.Attribute.RichText &
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
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    indexLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    rundownItems: Schema.Attribute.Component<'motorsport.rundown-item', true> &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    showBody: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showEyebrow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showTitle: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface MotorsportHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_hero_slides';
  info: {
    description: 'Site-scoped Motorsport homepage carousel slide';
    displayName: 'Hero Slide';
  };
  attributes: {
    ctaLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 28;
      }>;
    ctaUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageAlt: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    internalName: Schema.Attribute.String & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    mobileImage: Schema.Attribute.Media<'images'>;
    sortOrder: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    subjectAnchor: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'center'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    video: Schema.Attribute.Component<'shared.hero-video', false>;
  };
}

export interface MotorsportHomeInformationBand extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_home_information_bands';
  info: {
    description: 'CMS-managed Motorsport homepage information band with live featured-event values';
    displayName: 'Homepage Race Control Band';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 320;
      }>;
    enabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    nextEventLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }> &
      Schema.Attribute.DefaultTo<'Next event'>;
    regionLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }> &
      Schema.Attribute.DefaultTo<'Region'>;
    regionValue: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Indonesia'>;
    ticketStatusLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }> &
      Schema.Attribute.DefaultTo<'Ticket status'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
  };
}

export interface MotorsportHomeTicketSection extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_home_ticket_sections';
  info: {
    description: 'Complete CMS-managed Motorsport homepage ticket card. The link must redirect to an approved partner; Sarga does not process payment.';
    displayName: 'Homepage Ticket Card';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    backgroundImageMobile: Schema.Attribute.Media<'images'>;
    ctaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Secure your seat'>;
    ctaUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 360;
      }>;
    eventLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }> &
      Schema.Attribute.DefaultTo<'Event'>;
    eventText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    footerText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    partnerLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Partner redirect / Secure'>;
    providerLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }> &
      Schema.Attribute.DefaultTo<'Provider'>;
    providerText: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface MotorsportInformationBandMetric
  extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_information_band_metrics';
  info: {
    description: 'One editable label/value item in a Motorsport metric group.';
    displayName: 'Metric Group Item';
  };
  attributes: {
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface MotorsportPageHero extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_page_heroes';
  info: {
    description: 'Reusable Motorsport page hero contract. Layout and overlays remain frontend-owned; optional primary and secondary actions are managed here.';
    displayName: 'Page Hero';
  };
  attributes: {
    backgroundAlt: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    backgroundMedia: Schema.Attribute.Media<'images' | 'videos'>;
    description: Schema.Attribute.RichText &
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
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    metrics: Schema.Attribute.Component<
      'motorsport.information-band-metric',
      true
    > &
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
    mobileBackgroundMedia: Schema.Attribute.Media<'images' | 'videos'>;
    primaryCtaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    primaryCtaTarget: Schema.Attribute.Enumeration<
      ['sameWindow', 'newWindow']
    > &
      Schema.Attribute.DefaultTo<'sameWindow'>;
    primaryCtaUrl: Schema.Attribute.String;
    secondaryCtaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    secondaryCtaTarget: Schema.Attribute.Enumeration<
      ['sameWindow', 'newWindow']
    > &
      Schema.Attribute.DefaultTo<'sameWindow'>;
    secondaryCtaUrl: Schema.Attribute.String;
    showDescription: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showEyebrow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showMedia: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showMetricGroup: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showPrimaryCta: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showSecondaryCta: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showTitle: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface MotorsportPageInformationBand extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_page_information_bands';
  info: {
    description: 'Reusable Motorsport information band rendered immediately after a page hero.';
    displayName: 'Page Information Band';
  };
  attributes: {
    description: Schema.Attribute.RichText &
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
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    metrics: Schema.Attribute.Component<
      'motorsport.information-band-metric',
      true
    > &
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
    showDescription: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showEyebrow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showMetricGroup: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    showTitle: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface MotorsportPageSection extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_page_sections';
  info: {
    description: '03 \u2014 A named supporting section such as Format, Rundown, or Race-day Guide. Use this for section copy, media, CTA, visibility, and order; do not use it for carousel slides.';
    displayName: 'Supporting Presentation Section';
  };
  attributes: {
    body: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    ctaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    ctaTarget: Schema.Attribute.Enumeration<['sameWindow', 'newWindow']> &
      Schema.Attribute.DefaultTo<'sameWindow'>;
    ctaUrl: Schema.Attribute.String;
    ecosystemTabLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    indexLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    itemCountLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
    items: Schema.Attribute.Component<'motorsport.page-section-item', true>;
    leadershipTabLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    legalText: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 300;
      }>;
    listLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    publicationTabLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    secondaryCtaLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    secondaryCtaTarget: Schema.Attribute.Enumeration<
      ['sameWindow', 'newWindow']
    > &
      Schema.Attribute.DefaultTo<'sameWindow'>;
    secondaryCtaUrl: Schema.Attribute.String;
    sectionKey: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    showBody: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showCta: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showEyebrow: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showMedia: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    showTitle: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    supportBody: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    supportLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    theme: Schema.Attribute.Enumeration<
      ['default', 'dark', 'light', 'accent']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface MotorsportPageSectionItem extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_page_section_items';
  info: {
    description: 'Ordered, independently visible content used by page sections such as Experience pillars, track panels, and Ticket Info bullets.';
    displayName: 'Section Item';
  };
  attributes: {
    accent: Schema.Attribute.Enumeration<
      ['crimson', 'orange', 'yellow', 'teal', 'blue']
    > &
      Schema.Attribute.DefaultTo<'crimson'>;
    description: Schema.Attribute.RichText &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    href: Schema.Attribute.String;
    hrefLabel: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    mediaAlt: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
  };
}

export interface MotorsportRuleItem extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_rule_items';
  info: {
    description: "Campaign do or don't guidance. Each item can be shown or hidden independently and ordered with sortOrder.";
    displayName: 'Event Rule';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    ruleType: Schema.Attribute.Enumeration<['do', 'dont']> &
      Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MotorsportRundownItem extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_rundown_items';
  info: {
    description: 'Public campaign or program schedule item. Each item can be shown or hidden independently and ordered with sortOrder.';
    displayName: 'Rundown Item';
  };
  attributes: {
    dateLabel: Schema.Attribute.String;
    dayLabel: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    endTime: Schema.Attribute.Time;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    startTime: Schema.Attribute.Time;
    status: Schema.Attribute.Enumeration<['upcoming', 'live', 'completed']> &
      Schema.Attribute.DefaultTo<'upcoming'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    venue: Schema.Attribute.String;
  };
}

export interface MotorsportTicketMapSection extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_ticket_map_sections';
  info: {
    description: 'Optional ticket map shown immediately before the ticket CTA on a Motorsport programme page.';
    displayName: 'Ticket Map Section';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    imageAlt: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }> &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 180;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface MotorsportWorldOfMotorsport extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_world_of_motorsports';
  info: {
    description: 'CMS-managed homepage racing-format heading, CTA, and discipline cards';
    displayName: 'World of Motorsport Section';
  };
  attributes: {
    ctaLabel: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }> &
      Schema.Attribute.DefaultTo<'Explore the calendar'>;
    ctaUrl: Schema.Attribute.String & Schema.Attribute.DefaultTo<'/events'>;
    description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 320;
      }>;
    disciplines: Schema.Attribute.Component<
      'motorsport.discipline-card',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
        },
        number
      >;
    enabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    titleAccent: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'Motorsport'>;
    titlePrefix: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }> &
      Schema.Attribute.DefaultTo<'The world of'>;
  };
}

export interface SharedEventSession extends Struct.ComponentSchema {
  collectionName: 'components_shared_event_sessions';
  info: {
    description: 'A single session/slot in an event schedule (e.g. practice, qualifying, race)';
    displayName: 'Event Session';
  };
  attributes: {
    day: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    endTime: Schema.Attribute.DateTime;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    startTime: Schema.Attribute.DateTime;
  };
}

export interface SharedFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_columns';
  info: {
    description: 'A titled group of managed footer links';
    displayName: 'Footer Column';
  };
  attributes: {
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 1000;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    links: Schema.Attribute.Component<'shared.footer-link', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
  };
}

export interface SharedFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_links';
  info: {
    description: 'A managed footer navigation or social link';
    displayName: 'Footer Link';
  };
  attributes: {
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 1000;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    href: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 80;
      }>;
    linkType: Schema.Attribute.Enumeration<['internal', 'external']> &
      Schema.Attribute.DefaultTo<'internal'>;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedHeroVideo extends Struct.ComponentSchema {
  collectionName: 'components_shared_hero_videos';
  info: {
    description: 'Optional muted hero video with a required primary source, optional alternate codec, and poster overrides';
    displayName: 'Hero Video';
  };
  attributes: {
    alternateVideo: Schema.Attribute.Media<'videos'>;
    enabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    mobilePosterImage: Schema.Attribute.Media<'images'>;
    posterImage: Schema.Attribute.Media<'images'>;
    primaryVideo: Schema.Attribute.Media<'videos'> & Schema.Attribute.Required;
  };
}

export interface SharedKeyHighlight extends Struct.ComponentSchema {
  collectionName: 'components_shared_key_highlights';
  info: {
    description: 'A concise operating or audience advantage';
    displayName: 'Key Highlight';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    label: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedPageAvailability extends Struct.ComponentSchema {
  collectionName: 'components_shared_page_availabilities';
  info: {
    description: 'Dedicated Page control: enable only after required page content is complete; disabled pages show the branded Coming Soon state';
    displayName: 'Page Availability';
  };
  attributes: {
    comingSoonDescription: Schema.Attribute.Text;
    comingSoonEyebrow: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Part of the Sarga ecosystem'>;
    comingSoonMedia: Schema.Attribute.Media<'images'>;
    comingSoonTitle: Schema.Attribute.String;
    launchTargetLabel: Schema.Attribute.String;
    noIndexWhileDisabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
    pageEnabled: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    showNotifyCta: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedPageSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_page_sections';
  info: {
    description: 'Reusable editorial section for site-scoped pages';
    displayName: 'Page Section';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    ctaLabel: Schema.Attribute.String;
    ctaTarget: Schema.Attribute.Enumeration<['sameWindow', 'newWindow']> &
      Schema.Attribute.DefaultTo<'sameWindow'>;
    ctaUrl: Schema.Attribute.String;
    enabled: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    eyebrow: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    sectionKey: Schema.Attribute.String & Schema.Attribute.Required;
    theme: Schema.Attribute.Enumeration<
      ['default', 'dark', 'light', 'accent']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Search and social metadata shared by public content';
    displayName: 'SEO';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    ogDescription: Schema.Attribute.Text;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'motorsport.about-capabilities': MotorsportAboutCapabilities;
      'motorsport.about-capability-card': MotorsportAboutCapabilityCard;
      'motorsport.campaign-slide': MotorsportCampaignSlide;
      'motorsport.detail-presentation': MotorsportDetailPresentation;
      'motorsport.discipline-card': MotorsportDisciplineCard;
      'motorsport.fia-rallycross-content': MotorsportFiaRallycrossContent;
      'motorsport.fia-rallycross-format-item': MotorsportFiaRallycrossFormatItem;
      'motorsport.fia-rallycross-format-section': MotorsportFiaRallycrossFormatSection;
      'motorsport.fia-rallycross-race-day-guide-section': MotorsportFiaRallycrossRaceDayGuideSection;
      'motorsport.fia-rallycross-rundown-section': MotorsportFiaRallycrossRundownSection;
      'motorsport.hero-slide': MotorsportHeroSlide;
      'motorsport.home-information-band': MotorsportHomeInformationBand;
      'motorsport.home-ticket-section': MotorsportHomeTicketSection;
      'motorsport.information-band-metric': MotorsportInformationBandMetric;
      'motorsport.page-hero': MotorsportPageHero;
      'motorsport.page-information-band': MotorsportPageInformationBand;
      'motorsport.page-section': MotorsportPageSection;
      'motorsport.page-section-item': MotorsportPageSectionItem;
      'motorsport.rule-item': MotorsportRuleItem;
      'motorsport.rundown-item': MotorsportRundownItem;
      'motorsport.ticket-map-section': MotorsportTicketMapSection;
      'motorsport.world-of-motorsport': MotorsportWorldOfMotorsport;
      'shared.event-session': SharedEventSession;
      'shared.footer-column': SharedFooterColumn;
      'shared.footer-link': SharedFooterLink;
      'shared.hero-video': SharedHeroVideo;
      'shared.key-highlight': SharedKeyHighlight;
      'shared.page-availability': SharedPageAvailability;
      'shared.page-section': SharedPageSection;
      'shared.seo': SharedSeo;
    }
  }
}
