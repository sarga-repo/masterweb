import { mergeConfig, type UserConfig } from "vite";

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    // Keep the Admin bundle ready for shared CSS imports from app.tsx. The
    // Content Manager modernization lives in src/admin/styles/admin.css.
    css: {
      preprocessorOptions: {
        // If you add SCSS later, configure it here.
      },
    },
    // Runtime DOM work remains limited to existing supported integrations;
    // shared editor styling should stay in imported CSS rather than being
    // injected into the page from bootstrap().
  });
};
