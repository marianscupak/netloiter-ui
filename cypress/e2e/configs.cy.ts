import {
  clickTableRowButton,
  createConfig,
  deleteConfig,
  goToPath,
} from "../support";

const createdConfigName = "Cypress Test Config";

describe("configs module", () => {
  it("Creates config, checks detail, compares export and deletes config", () => {
    createConfig(createdConfigName);
    goToPath("/configs");

    clickTableRowButton(createdConfigName, "DETAIL");

    cy.get("body").compareSnapshot("created_config_detail");

    cy.get("button").contains("EXPORT").click();

    const fileName = `${createdConfigName.replace(
      new RegExp(" ", "g"),
      "_",
    )}.json`;

    cy.readFile(`cypress/downloads/${fileName}`, {
      timeout: 2000,
      log: false,
    }).then((config) =>
      cy
        .fixture("config")
        .then((fixture) => expect(config).to.deep.equal(fixture)),
    );

    deleteConfig(createdConfigName);
  });
});
