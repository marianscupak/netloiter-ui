export const goToPath = (path: string) => cy.visit(path);

export const typeInInput = (name: string, value: string) =>
  cy.get(`input[name="${name}"]`).type(value);

export const useSelect = (name: string, value: string) =>
  cy
    .get(`input[name="${name}"]`)
    .parent()
    .click()
    .get(`ul > li[data-value="${value}"]`)
    .click();

export const toggleCheckbox = (name: string) =>
  cy.get(`input[name="${name}"]`).click();

export const clickTableRowButton = (rowName: string, buttonName: string) =>
  cy
    .get("div")
    .contains(rowName)
    .last()
    .parent()
    .children()
    .find("button")
    .contains(buttonName)
    .click();

export const createGuard = (guardName: string) => {
  goToPath("/guards/create");
  typeInInput("name", guardName);
  useSelect("type", "TimePeriod");
  typeInInput("truePeriod", "5");
  typeInInput("falsePeriod", "5");
  toggleCheckbox("instant");
  cy.get("button").contains("SAVE").click();
};

export const deleteGuard = (guardName: string) => {
  goToPath("/guards");

  clickTableRowButton(guardName, "DELETE");

  cy.get("div").contains("Guard successfully deleted").should("exist");
};

export const createAction = (actionName: string) => {
  goToPath("/actions/create");
  typeInInput("name", actionName);
  useSelect("type", "Reorder");
  typeInInput("count", "5");
  useSelect("reorderStrategy", "random");
  cy.get("button").contains("SAVE").click();
};

export const deleteAction = (actionName: string) => {
  goToPath("/actions");

  clickTableRowButton(actionName, "DELETE");
  cy.get("div").contains("Action successfully deleted").should("exist");
};

export const createRule = (
  ruleName: string,
  guardName: string,
  actionName: string,
) => {
  createGuard(guardName);
  createAction(actionName);

  goToPath("/rules/create");
  typeInInput("name", ruleName);

  useSelect("type", "Any");

  // delete prefilled guard and action
  cy.get("div.cursor-pointer").first().click();
  cy.get("div.cursor-pointer").click();

  cy.get("button").contains("LOAD GUARD").click();
  cy.get("#loadGuardSelect").parent().click();
  cy.get("li").contains(guardName).click();

  cy.get("button").contains("LOAD ACTION").click();
  cy.get("#loadActionSelect").parent().click();
  cy.get("li").contains(actionName).click();

  cy.get("button").contains("SAVE").click();
};

export const deleteRule = (
  ruleName: string,
  guardName: string,
  actionName: string,
) => {
  goToPath("/rules");

  clickTableRowButton(ruleName, "DELETE");
  cy.get("div").contains("Rule successfully deleted").should("exist");

  deleteGuard(guardName);
  deleteAction(actionName);
};

export const createConfig = (configName: string) => {
  goToPath("/configs/create");
  typeInInput("name", configName);
  useSelect("mode", "nf_mark");

  // delete prefilled flow
  cy.get("div.cursor-pointer").first().click();

  cy.get("button").contains("ADD FLOW").click();
  cy.get("button").contains("EDIT PARAMETERS").click();
  cy.get('input[type="checkbox"]').first().click();
  cy.get("body").trigger("keydown", { keyCode: 27 });

  cy.get('input[name="flows.0.all"]').click();

  cy.get("button").contains("ADD FLOW").click();
  cy.get("button").eq(1).click();
  cy.get('input[type="checkbox"]').eq(2).click();
  cy.get("body").trigger("keydown", { keyCode: 27 });
  typeInInput("flows.1.ip", "127.0.0.1");
  useSelect("flows.1.action", "ignore");

  cy.get("button").contains("SAVE").click();
};

export const deleteConfig = (guardName: string) => {
  goToPath("/configs");

  clickTableRowButton(guardName, "DELETE");

  cy.get("div").contains("Config successfully deleted").should("exist");
};

export const createScenario = (
  scenarioName: string,
  ruleName: string,
  guardName: string,
  actionName: string,
) => {
  createRule(ruleName, guardName, actionName);

  goToPath("/scenarios/create");

  typeInInput("name", scenarioName);
  useSelect("type", "SequentialHTTP");
  cy.get("div.cursor-pointer").first().click();

  cy.get("button").contains("LOAD RULE").click();
  cy.get("#loadRuleSelect").click();
  cy.get("li").contains(ruleName).click();

  cy.get("button").contains("SAVE").click();
};

export const deleteScenario = (
  scenarioName: string,
  ruleName: string,
  guardName: string,
  actionName: string,
) => {
  goToPath("/scenarios");

  clickTableRowButton(scenarioName, "DELETE");

  cy.get("div").contains("Scenario successfully deleted").should("exist");

  deleteRule(ruleName, guardName, actionName);
};
