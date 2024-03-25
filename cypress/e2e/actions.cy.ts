import {
  clickTableRowButton,
  createAction,
  deleteAction,
  goToPath,
} from "../support";

const createdActionName = "Cypress Test Action";

describe("actions module", () => {
  it("Creates action, checks detail and deletes action", () => {
    createAction(createdActionName);
    goToPath("/actions");

    clickTableRowButton(createdActionName, "DETAIL");

    cy.get("body").compareSnapshot("created_action_detail");

    deleteAction(createdActionName);
  });
});
