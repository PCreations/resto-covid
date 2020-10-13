// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import "@testing-library/cypress/add-commands";
import { testUser } from "./test-user";

Cypress.Commands.add("visitContactForm", (restaurantId) => {
  cy.visit(`/form/${restaurantId}`);
});

Cypress.Commands.add("visitSignInForm", () => {
  cy.visit("/signIn");
});

Cypress.Commands.add("visitSignUpForm", () => {
  cy.visit("/signUp");
});

Cypress.Commands.add("fillContactForm", (contact) => {
  cy.findByLabelText(/prénom \/ first name/i).type(contact.firstName);
  cy.findByLabelText(/nom \/ last name/i).type(contact.lastName);
  cy.findByLabelText(/numéro de téléphone \/ phone number/i).type(
    contact.phoneNumber
  );
  cy.findByText(/envoyer les coordonnées \/ send/i).click();
});

Cypress.Commands.add("expectContactToBeSent", () => {
  cy.findByText(/merci ! coordonnées bien envoyées./i).should("exist");
});

Cypress.Commands.add("expectContactToBeVisible", (contact) => {
  cy.findByText(contact.date).should("exist");
  cy.findByText(contact.firstName).should("exist");
  cy.findByText(contact.lastName).should("exist");
  cy.findByText(contact.phoneNumber).should("exist");
});

Cypress.Commands.add("goToDashboard", () => {
  cy.visit("/");
});

Cypress.Commands.add("fillBackupWordsForm", () => {
  cy.get("textarea").type(testUser.backupWords);
  cy.findByText(/valider/i).click();
});

Cypress.Commands.add("expectToBeAskToConfigureDevice", () => {
  cy.findByText(
    /cet appareil n'est pas configuré pour accéder aux contacts. Veuillez entrez la liste des mots qui vous a été fournie à l'inscription :/i
  ).should("exist");
});

Cypress.Commands.add("signInWithTestUser", () => {
  cy.findByLabelText("email").type(testUser.email);
  cy.findByLabelText("password").type(testUser.password);
  cy.get("button").click();
});

Cypress.Commands.add("expectToBeOnDashboard", () => {
  cy.findByText(/afficher le qr code/i).should("exist");
});

Cypress.Commands.add("fillSignUpForm", (restaurant) => {
  cy.findByLabelText("name").type(restaurant.name);
  cy.findByLabelText("email").type(restaurant.email);
  cy.findByLabelText("password").type(restaurant.password);
  cy.findByLabelText("passwordConfirmation").type(restaurant.password);
  cy.findByLabelText("address").type(restaurant.address);
  cy.findByLabelText("postalCode").type(restaurant.postalCode);
  cy.findByLabelText("city").type(restaurant.city);
  cy.findByText(/enregistrer mon restaurant/i).click();
});
