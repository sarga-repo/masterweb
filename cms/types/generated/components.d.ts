import type { Schema, Struct } from '@strapi/strapi';

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
      'shared.event-session': SharedEventSession;
      'shared.key-highlight': SharedKeyHighlight;
      'shared.seo': SharedSeo;
    }
  }
}
