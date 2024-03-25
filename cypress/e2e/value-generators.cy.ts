import { goToPath, useSelect } from "../support";

const getCountValueGenerator = () =>
  cy.get("div").contains("Count").parent().parent();

describe("value generators", () => {
  it("Value generators render correctly", () => {
    goToPath("/actions/create");
    useSelect("type", "Reorder");
    cy.get("span").contains("Generator").click();

    useSelect("count.type", "0");
    getCountValueGenerator().compareSnapshot("normal_distribution");

    useSelect("count.type", "1");
    getCountValueGenerator().compareSnapshot("uniform_distribution");

    useSelect("count.type", "2");
    getCountValueGenerator().compareSnapshot("sequence");
  });
});
