import { defineConfig } from "cypress";
import { configureVisualRegression } from "cypress-visual-regression/dist/plugin";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, _config) {
      configureVisualRegression(on);
    },
    testIsolation: false,
    env: {
      visualRegressionType: "regression",
    },
    screenshotsFolder: "./cypress/screenshots",
    baseUrl: "http://localhost:3000",
  },
});
