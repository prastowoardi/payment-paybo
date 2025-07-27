require('dotenv').config();
const { defineConfig } = require("cypress");
const { authenticator } = require('otplib');
const baseUrl = process.env.BASEURL

module.exports = defineConfig({
  viewportHeight: 1280,
  viewportWidth: 1880,
  experimentalStudio: true,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: baseUrl,
    env: {
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
      baseUrl: process.env.BASEURL,
    },
    setupNodeEvents(on, config) {
       on('task', {
        generateOtp(secret) {
          return authenticator.generate(secret);
        },
      });

      return config;
    },
    specPattern: "cypress/e2e/**/*.js",
  },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91 Safari/537.36',
});
