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
      'motorsport.hero-slide': MotorsportHeroSlide;
      'motorsport.rule-item': MotorsportRuleItem;
      'motorsport.rundown-item': MotorsportRundownItem;
      'shared.event-session': SharedEventSession;
      'shared.key-highlight': SharedKeyHighlight;
      'shared.page-section': SharedPageSection;
      'shared.seo': SharedSeo;
    }
  }
}
