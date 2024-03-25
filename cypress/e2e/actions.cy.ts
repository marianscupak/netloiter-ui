import {
  clickTableRowButton,
  createAction,
  deleteAction,
  goToPath,
  useSelect,
} from "../support";
import { actionTypeOptions } from "netloiter-ui-fe/src/components/forms/actions/create-action-form-types";

const createdActionName = "Cypress Test Action";

describe("actions module", () => {
  it("Creates action, checks detail and deletes action", () => {
    createAction(createdActionName);
    goToPath("/actions");

    clickTableRowButton(createdActionName, "DETAIL");

    cy.get("body").compareSnapshot("created_action_detail");

    deleteAction(createdActionName);
  });
  it("Renders all action types correctly", () => {
    goToPath("/actions/create");

    for (const option of actionTypeOptions) {
      useSelect("type", option.value);
      cy.get('input[name="name"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .compareSnapshot(`${option.value}_action`);
    }
  });
});
