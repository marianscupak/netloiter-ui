import {
  clickTableRowButton,
  createRule,
  deleteRule,
  goToPath,
} from "../support";

const createdGuardName = "Cypress Rule Test Guard";
const createdActionName = "Cypress Rule Test Action";
const createdRuleName = "Cypress Test Rule";

describe("rules module", () => {
  it("Creates guard and action, creates a rule with them, checks rule detail and deletes everything that was created", () => {
    createRule(createdRuleName, createdGuardName, createdActionName);

    goToPath("/rules");

    clickTableRowButton(createdRuleName, "DETAIL");

    cy.get("body").compareSnapshot("created_rule_detail");

    deleteRule(createdRuleName, createdGuardName, createdActionName);
  });
});
