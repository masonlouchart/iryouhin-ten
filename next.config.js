// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require("next-pwa");

module.exports = withPWA({
  pwa: {
    disable: process.env.NODE_ENV === "development",
    register: true,
    dest: "public",
    buildExcludes: [/chunks\/images\/.*$/],
  },
});
