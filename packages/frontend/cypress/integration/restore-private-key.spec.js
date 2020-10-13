import { createFirebaseAuthenticationGateway } from "../../src/adapters/authentication-gateway";
import { createSealedBoxEncrypter } from "../../src/adapters/encrypter";
import { createFirebaseRestaurantRepository } from "../../src/adapters/restaurant-repository";
import { db } from "../../src/adapters/shared/firebase";
import { createAddContact } from "../../src/use-cases/add-contact";
import { createSignIn } from "../../src/use-cases/sign-in";
import { testUser } from "../support/test-user";

describe("restore/add device", () => {
  let contactId;
  beforeEach(async () => {
    cy.clearLocalStorage();
    const restaurantRepository = createFirebaseRestaurantRepository();
    const authenticationGateway = createFirebaseAuthenticationGateway();
    const encrypter = createSealedBoxEncrypter();
    const addContact = createAddContact({ restaurantRepository, encrypter });
    const signIn = createSignIn({ authenticationGateway });
    contactId = await addContact({
      restaurantId: testUser.id,
      contactInformation: {
        firstName: "First Name",
        lastName: "Last Name",
        phoneNumber: "0102030405",
      },
      now: new Date("2020-10-13T18:03:30.398Z"),
    });
    await signIn({
      email: testUser.email,
      password: testUser.password,
    });
  });

  afterEach(() => {
    return db
      .collection("restaurants")
      .doc(testUser.id)
      .collection("contacts")
      .doc(contactId)
      .delete();
  });

  it("can add/restore its account on a not configured device", () => {
    cy.goToDashboard();

    cy.expectToBeAskToConfigureDevice();

    cy.fillBackupWordsForm();

    cy.expectContactToBeVisible({
      date: "13/10/2020 20:03",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "0102030405",
    });
  });
});
