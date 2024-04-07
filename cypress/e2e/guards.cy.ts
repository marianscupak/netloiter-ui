import {
  clickTableRowButton,
  createGuard,
  deleteGuard,
  goToPath,
  useSelect,
} from "../support";
import { guardTypeOptions } from "netloiter-ui-fe/src/components/forms/guards/create-guard-form-types";

const createdGuardName = "Cypress Test Guard";

describe("guards module", () => {
  it("Creates guard, checks detail and deletes guard", () => {
    createGuard(createdGuardName);
    goToPath("/guards");

    clickTableRowButton(createdGuardName, "DETAIL");

    cy.get("body").compareSnapshot("created_guard_detail");

    deleteGuard(createdGuardName);
  });
  it("Renders all guard types correctly", () => {
    goToPath("/guards/create");

    for (const option of guardTypeOptions) {
      useSelect("type", option.value as string);
      cy.get('input[name="name"]')
        .parent()
        .parent()
        .parent()
        .parent()
        .compareSnapshot(`${option.value}_guard`);
    }
  });
});
