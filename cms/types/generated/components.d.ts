import type { Schema, Struct } from '@strapi/strapi';

export interface MotorsportCampaignSlide extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_campaign_slides';
  info: {
    description: 'Campaign banner slide with optional call to action';
    displayName: 'Campaign Slide';
  };
  attributes: {
    ctaLabel: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
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

export interface MotorsportRuleItem extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_rule_items';
  info: {
    description: "Campaign do or don't guidance";
    displayName: 'Event Rule';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    ruleType: Schema.Attribute.Enumeration<['do', 'dont']> &
      Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MotorsportRundownItem extends Struct.ComponentSchema {
  collectionName: 'components_motorsport_rundown_items';
  info: {
    description: 'Public campaign or program schedule item';
    displayName: 'Rundown Item';
  };
  attributes: {
    dateLabel: Schema.Attribute.String;
    dayLabel: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    endTime: Schema.Attribute.Time;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    startTime: Schema.Attribute.Time;
    status: Schema.Attribute.Enumeration<['upcoming', 'live', 'completed']> &
      Schema.Attribute.DefaultTo<'upcoming'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    venue: Schema.Attribute.String;
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
      'motorsport.campaign-slide': MotorsportCampaignSlide;
      'motorsport.discipline-card': MotorsportDisciplineCard;
      'motorsport.hero-slide': MotorsportHeroSlide;
      'motorsport.home-information-band': MotorsportHomeInformationBand;
      'motorsport.rule-item': MotorsportRuleItem;
      'motorsport.rundown-item': MotorsportRundownItem;
      'motorsport.world-of-motorsport': MotorsportWorldOfMotorsport;
      'shared.event-session': SharedEventSession;
      'shared.hero-video': SharedHeroVideo;
      'shared.key-highlight': SharedKeyHighlight;
      'shared.page-availability': SharedPageAvailability;
      'shared.page-section': SharedPageSection;
      'shared.seo': SharedSeo;
    }
  }
}
