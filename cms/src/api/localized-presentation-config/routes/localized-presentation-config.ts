export default {
  routes: [
    {
      method: "GET",
      path: "/localized-presentation-config/resolve",
      handler: "localized-presentation-config.resolve",
      config: { auth: false },
    },
  ],
};
