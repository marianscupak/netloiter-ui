import {
  clickTableRowButton,
  createScenario,
  deleteScenario,
  goToPath,
} from "../support";

const createdGuardName = "Cypress Scenario Test Guard";
const createdActionName = "Cypress Scenario Test Action";
const createdRuleName = "Cypress Scenario Test Rule";
const createdScenarioName = "Cypress Test Scenario";

describe("scenarios module", () => {
  it("Creates guard and action, creates a rule with them, creates scenario with it, checks scenario detail and deletes everything that was created", () => {
    createScenario(
      createdScenarioName,
      createdRuleName,
      createdGuardName,
      createdActionName,
    );

    goToPath("/scenarios");

    clickTableRowButton(createdScenarioName, "DETAIL");

    cy.get("body").compareSnapshot("created_scenario_detail");

    cy.get("button").contains("EXPORT").click();

    const fileName = `${createdScenarioName.replace(
      new RegExp(" ", "g"),
      "_",
    )}.json`;

    cy.readFile(`cypress/downloads/${fileName}`, {
      timeout: 2000,
      log: false,
    }).then((config) =>
      cy
        .fixture("scenario")
        .then((fixture) => expect(config).to.deep.equal(fixture)),
    );

    deleteScenario(
      createdScenarioName,
      createdRuleName,
      createdGuardName,
      createdActionName,
    );
  });
});
