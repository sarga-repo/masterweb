import type { Core } from '@strapi/strapi';

type SiteScope = 'gateway' | 'motorsport' | 'horsesport' | 'shared';

type WorkspaceRole = {
  scope: SiteScope;
  name: string;
  code: string;
  accessAction: string;
  conditionName: string;
  subjects: string[];
  unscopedSubjects?: string[];
  accountEnvPrefix: string;
};

type ManagedPermission = {
  action: string;
  subject?: string | null;
  conditions?: string[];
};

const PLUGIN_NAME = 'admin';
const SUPER_ADMIN_CODE = 'strapi-super-admin';

const CONTENT_ACTIONS = {
  create: 'plugin::content-manager.explorer.create',
  read: 'plugin::content-manager.explorer.read',
  update: 'plugin::content-manager.explorer.update',
  delete: 'plugin::content-manager.explorer.delete',
  publish: 'plugin::content-manager.explorer.publish',
} as const;

const SHARED_EDITORIAL_SUBJECTS = [
  'api::site-page.site-page',
  'api::news-article.news-article',
  'api::event.event',
  'api::media-gallery.media-gallery',
  'api::ticket-cta.ticket-cta',
  'api::partner.partner',
];

export const WORKSPACE_ROLES: WorkspaceRole[] = [
  {
    scope: 'gateway',
    name: 'Sarga Gateway Admin',
    code: 'sarga-gateway-admin',
    accessAction: 'admin::sarga-workspaces.access-gateway',
    conditionName: 'sarga-workspaces-is-gateway-content',
    subjects: [
      ...SHARED_EDITORIAL_SUBJECTS,
      'api::ecosystem-business.ecosystem-business',
    ],
    unscopedSubjects: ['api::homepage.homepage'],
    accountEnvPrefix: 'CMS_GATEWAY_ADMIN',
  },
  {
    scope: 'motorsport',
    name: 'Sarga Motorsport Admin',
    code: 'sarga-motorsport-admin',
    accessAction: 'admin::sarga-workspaces.access-motorsport',
    conditionName: 'sarga-workspaces-is-motorsport-content',
    subjects: [
      ...SHARED_EDITORIAL_SUBJECTS,
      'api::motorsport-program.motorsport-program',
      'api::motorsport-rider.motorsport-rider',
      'api::motorsport-standing.motorsport-standing',
      'api::motorsport-regulation.motorsport-regulation',
      'api::merchandise-item.merchandise-item',
    ],
    accountEnvPrefix: 'CMS_MOTORSPORT_ADMIN',
  },
  {
    scope: 'horsesport',
    name: 'Sarga Horse Sport Admin',
    code: 'sarga-horsesport-admin',
    accessAction: 'admin::sarga-workspaces.access-horsesport',
    conditionName: 'sarga-workspaces-is-horsesport-content',
    subjects: SHARED_EDITORIAL_SUBJECTS,
    accountEnvPrefix: 'CMS_HORSESPORT_ADMIN',
  },
  {
    scope: 'shared',
    name: 'Sarga Shared Library Admin',
    code: 'sarga-shared-admin',
    accessAction: 'admin::sarga-workspaces.access-shared',
    conditionName: 'sarga-workspaces-is-shared-content',
    subjects: [
      ...SHARED_EDITORIAL_SUBJECTS,
      'api::ecosystem-business.ecosystem-business',
    ],
    unscopedSubjects: [
      'api::site.site',
      'api::leadership-person.leadership-person',
      'api::timeline-item.timeline-item',
    ],
    accountEnvPrefix: 'CMS_SHARED_ADMIN',
  },
];

const conditionId = (role: WorkspaceRole) => `admin::${role.conditionName}`;

export async function registerWorkspaceAccessControl(strapi: Core.Strapi) {
  const permissionService = strapi.service('admin::permission');

  await permissionService.actionProvider.registerMany(
    WORKSPACE_ROLES.map((role) => ({
      section: 'plugins',
      displayName: `Access ${role.name.replace(' Admin', '')} workspace`,
      uid: role.accessAction.replace('admin::', ''),
      pluginName: PLUGIN_NAME,
    })),
  );

  await permissionService.conditionProvider.registerMany(
    WORKSPACE_ROLES.map((role) => ({
      displayName: `${role.name.replace(' Admin', '')} content only`,
      name: role.conditionName,
      plugin: PLUGIN_NAME,
      category: 'Sarga site scope',
      handler: () => ({ siteScope: role.scope }),
    })),
  );

  registerSiteScopeWriteGuard(strapi);
}

function buildRolePermissions(role: WorkspaceRole): ManagedPermission[] {
  const permissions: ManagedPermission[] = [
    { action: role.accessAction },
    { action: 'plugin::upload.read' },
    { action: 'plugin::upload.configure-view' },
    { action: 'plugin::upload.assets.create' },
    { action: 'plugin::upload.assets.download' },
    { action: 'plugin::upload.assets.copy-link' },
  ];

  for (const subject of role.subjects) {
    permissions.push({ action: CONTENT_ACTIONS.create, subject });

    for (const action of [
      CONTENT_ACTIONS.read,
      CONTENT_ACTIONS.update,
      CONTENT_ACTIONS.delete,
      CONTENT_ACTIONS.publish,
    ]) {
      permissions.push({
        action,
        subject,
        conditions: [conditionId(role)],
      });
    }
  }

  for (const subject of role.unscopedSubjects ?? []) {
    for (const action of Object.values(CONTENT_ACTIONS)) {
      permissions.push({ action, subject });
    }
  }

  return permissions;
}

export async function bootstrapWorkspaceAccessControl(strapi: Core.Strapi) {
  const roleService = strapi.service('admin::role');

  for (const roleDefinition of WORKSPACE_ROLES) {
    let role = await roleService.findOne({ code: roleDefinition.code });

    if (!role) {
      role = await roleService.create({
        name: roleDefinition.name,
        code: roleDefinition.code,
        description: `Manages only ${roleDefinition.scope} CMS content and its Sarga workspace.`,
      });
    }

    await roleService.assignPermissions(
      role.id,
      buildRolePermissions(roleDefinition),
    );
    await provisionWorkspaceAccount(strapi, roleDefinition, role.id);
  }

  // Custom application actions are registered after Strapi's built-in role setup.
  // Refreshing the generated Super Admin permissions makes every workspace visible
  // without granting cross-site actions to any managed site role.
  await roleService.resetSuperAdminPermissions();
}

async function provisionWorkspaceAccount(
  strapi: Core.Strapi,
  role: WorkspaceRole,
  roleId: string | number,
) {
  const email = process.env[`${role.accountEnvPrefix}_EMAIL`]
    ?.trim()
    .toLowerCase();
  const password = process.env[`${role.accountEnvPrefix}_PASSWORD`];

  if (!email && !password) return;

  if (!email || !password) {
    strapi.log.warn(
      `[Sarga RBAC] ${role.accountEnvPrefix}_EMAIL and ${role.accountEnvPrefix}_PASSWORD must both be set; account was not provisioned.`,
    );
    return;
  }

  const existingUser = await strapi.db.query('admin::user').findOne({
    where: { email },
    populate: ['roles'],
  });

  if (existingUser) {
    const hasExpectedRole = existingUser.roles?.some(
      (existingRole: { code?: string }) => existingRole.code === role.code,
    );

    if (!hasExpectedRole) {
      strapi.log.warn(
        `[Sarga RBAC] Existing admin ${email} was not reassigned automatically. Assign the ${role.name} role in Settings > Administration panel > Users.`,
      );
    }
    return;
  }

  const firstname =
    process.env[`${role.accountEnvPrefix}_FIRSTNAME`]?.trim() || 'Sarga';
  const lastname =
    process.env[`${role.accountEnvPrefix}_LASTNAME`]?.trim() ||
    role.scope.replace(/^./, (character) => character.toUpperCase());

  await strapi.service('admin::user').create({
    firstname,
    lastname,
    email,
    password,
    isActive: true,
    roles: [roleId],
  });

  strapi.log.info(
    `[Sarga RBAC] Provisioned ${role.name} account for ${email}.`,
  );
}

function registerSiteScopeWriteGuard(strapi: Core.Strapi) {
  strapi.documents.use(async (context, next) => {
    const documentContext = context as any;
    const requestContext = strapi.requestContext.get();
    const requestUrl = requestContext?.request?.url;
    const userId = requestContext?.state?.user?.id;

    if (!requestUrl?.startsWith('/content-manager') || !userId) {
      return next();
    }

    const schema = documentContext.contentType;
    if (!schema?.attributes?.siteScope) {
      return next();
    }

    const user = await strapi.db.query('admin::user').findOne({
      where: { id: userId },
      populate: ['roles'],
    });
    const roleCodes = (user?.roles ?? []).map(
      (role: { code?: string }) => role.code,
    );

    if (roleCodes.includes(SUPER_ADMIN_CODE)) {
      return next();
    }

    const managedRoles = WORKSPACE_ROLES.filter((role) =>
      roleCodes.includes(role.code),
    );
    if (managedRoles.length === 0) {
      return next();
    }
    if (managedRoles.length > 1) {
      throw new Error(
        'This account has multiple Sarga site-admin roles. Assign exactly one site workspace role.',
      );
    }

    if (
      ['create', 'update', 'clone'].includes(documentContext.action) &&
      documentContext.params?.data
    ) {
      documentContext.params.data.siteScope = managedRoles[0].scope;
    }

    return next();
  });
}
