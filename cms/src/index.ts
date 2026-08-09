import type { Core } from '@strapi/strapi';

import {
  bootstrapWorkspaceAccessControl,
  registerWorkspaceAccessControl,
} from './access-control/sarga-workspaces';
import seedDemoContent from './seed';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async register({ strapi }: { strapi: Core.Strapi }) {
    await registerWorkspaceAccessControl(strapi);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * Seeds local demo content and public read permissions when
   * SEED_DEMO_CONTENT=true (see src/seed.ts). No-op otherwise.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await bootstrapWorkspaceAccessControl(strapi);
    await seedDemoContent(strapi);
  },
};
