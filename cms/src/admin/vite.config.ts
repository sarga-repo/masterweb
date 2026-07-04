import { mergeConfig, type UserConfig } from "vite";

export default (config: UserConfig) => {
  return mergeConfig(config, {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    // Inject brand-level CSS that goes beyond theme tokens.
    // These styles target the Strapi admin login page, sidebar,
    // and global chrome for a premium Sarga gateway feel.
    css: {
      preprocessorOptions: {
        // If you add SCSS later, configure it here.
      },
    },
    // NOTE: For deeper runtime CSS injection (e.g. login page
    // background, custom scrollbars, font overrides), add a
    // <style> tag in the bootstrap() function inside app.tsx
    // or serve a custom CSS file from cms/public/.
  });
};
