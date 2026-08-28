import type { Core } from "@strapi/strapi";

import {
  bootstrapWorkspaceAccessControl,
  registerWorkspaceAccessControl,
} from "./access-control/sarga-workspaces";
import { ensureSargaLocales, registerSargaI18nGuards } from "./i18n/sarga-i18n";
import { assertInquiryNotificationEnvironment } from "./email/inquiry-notifications";
import { resolveMotorsportMailEnvironment } from "./email/motorsport-mail-settings";
import seedDemoContent from "./seed";
import { registerMotorsportRevalidation } from "./revalidation/motorsport-revalidation";
import { migrateMotorsportPageSingleTypes } from "./migrations/motorsport-page-single-types";
import { migrateMotorsportOwnership } from "./migrations/motorsport-ownership";
import { ensureMotorsportThemeSettings } from "./migrations/motorsport-theme-settings";
import { ensureMotorsportProgramEditorLayout } from "./migrations/motorsport-program-editor-layout";
import { repairMotorsportContentManagerConfiguration } from "./migrations/motorsport-content-manager-repair";
import { migrateMotorsportContentManagerLayouts } from "./migrations/motorsport-content-manager-layout";
import { retireMotorsportLegacyContent } from "./migrations/motorsport-legacy-retirement";
import { backfillMotorsportShowFieldDefaults } from "./migrations/motorsport-show-field-defaults";
import { ensureIjtcPresentation } from "./migrations/motorsport-ijtc-presentation";
import { ensureFiaPresentation } from "./migrations/motorsport-fia-presentation";
import { ensureMotorsportTicketsPage } from "./migrations/motorsport-tickets-page";
import { ensureFrontendApiTokenPermissions } from "./access-control/api-token-permissions";
import {
  backfillMotorsportPageRoutes,
  registerMotorsportPageRouteGuards,
} from "./motorsport/page-route-registry";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  async register({ strapi }: { strapi: Core.Strapi }) {
    await registerWorkspaceAccessControl(strapi);
    registerSargaI18nGuards(strapi);
    registerMotorsportPageRouteGuards(strapi);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * Seeds local demo content and public read permissions when
   * SEED_DEMO_CONTENT=true (see src/seed.ts). No-op otherwise.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    assertInquiryNotificationEnvironment(
      await resolveMotorsportMailEnvironment(strapi),
    );
    await ensureSargaLocales(strapi);
    await bootstrapWorkspaceAccessControl(strapi);
    await ensureFrontendApiTokenPermissions(strapi);
    await seedDemoContent(strapi);
    await migrateMotorsportPageSingleTypes(strapi);
    await migrateMotorsportOwnership(strapi);
    await ensureMotorsportThemeSettings(strapi);
    await ensureMotorsportProgramEditorLayout(strapi);
    await repairMotorsportContentManagerConfiguration(strapi);
    await migrateMotorsportContentManagerLayouts(strapi);
    await retireMotorsportLegacyContent(strapi);
    await backfillMotorsportShowFieldDefaults(strapi);
    await ensureIjtcPresentation(strapi);
    await ensureFiaPresentation(strapi);
    await ensureMotorsportTicketsPage(strapi);
    await backfillMotorsportPageRoutes(strapi);
    registerMotorsportRevalidation(strapi);
  },
};
