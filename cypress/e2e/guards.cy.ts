import {
  clickTableRowButton,
  createGuard,
  deleteGuard,
  goToPath,
} from "../support";

const createdGuardName = "Cypress Test Guard";

describe("guards module", () => {
  it("Creates guard, checks detail and deletes guard", () => {
    createGuard(createdGuardName);
    goToPath("/guards");

    clickTableRowButton(createdGuardName, "DETAIL");

    cy.get("body").compareSnapshot("created_guard_detail");

    deleteGuard(createdGuardName);
  });
});
