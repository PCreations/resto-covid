const SentryWebpackPlugin = require("@sentry/webpack-plugin");

module.exports = function override(config) {
  if (!config.plugins) {
    config.plugins = [];
  }

  config.plugins.push(
    new SentryWebpackPlugin({
      // sentry-cli configuration
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "pierre-criulanscy-sasu",
      project: "resto-covid",

      // webpack specific configuration
      include: ".",
      ignore: ["node_modules", "webpack.config.js"],
    })
  );

  return config;
};
