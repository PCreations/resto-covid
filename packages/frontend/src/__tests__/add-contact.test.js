import { createInMemoryRestaurantRepository } from "../adapters/restaurant-repository";
import { createIdentityEncrypter } from "../adapters/encrypter";
import { createAddContact } from "../use-cases/add-contact";
import {
  EmailMissingError,
  InvalidEmailError,
  FirstNameMissingError,
  LastNameMissingError,
  PhoneNumberMissingError,
} from "../domain/ensure-contact-is-valid";

describe("addContact", () => {
  it("adds contact information encrypted from restaurant's public key", async () => {
    const now = new Date();
    const contactInformation = {
      email: "pcriulan@gmail.com",
      firstName: "Pierre",
      lastName: "Criulanscy",
      phoneNumber: "0102030405",
    };
    const restaurantId = "restaurant-id";
    const restaurantPublicKey = "restaurant-public-key";
    const restaurantRepository = createInMemoryRestaurantRepository({
      [restaurantId]: {
        publicKey: restaurantPublicKey,
        contacts: [],
      },
    });
    const encrypter = createIdentityEncrypter();
    const addContact = createAddContact({
      restaurantRepository,
      encrypter,
    });

    await addContact({ restaurantId, contactInformation, now });

    const contacts = await restaurantRepository.getContacts({ restaurantId });

    const expectedContact = {
      date: now,
      contact: encrypter.encrypt({
        data: contactInformation,
        publicKey: restaurantPublicKey,
      }),
    };
    expect(contacts).toContainEqual(expectedContact);
  });

  describe("contact information errors", () => {
    it("should throw an EmailMissingError if email is empty", async () => {
      await expectAddContact({
        email: "",
      }).toThrow(EmailMissingError);
    });

    it("should throw an InvalidEmailError if email is invalid", async () => {
      await expectAddContact({
        email: "invalid-email@+.com",
      }).toThrow(InvalidEmailError);
    });

    it("should throw an FirstNameMissingError is first name is empty", async () => {
      await expectAddContact({
        firstName: "",
      }).toThrow(FirstNameMissingError);
    });

    it("should throw an LastNameMissingError is last name is empty", async () => {
      await expectAddContact({
        lastName: "",
      }).toThrow(LastNameMissingError);
    });

    it("should throw an PhoneNumberMissingError is phone number is empty", async () => {
      await expectAddContact({
        phoneNumber: "",
      }).toThrow(PhoneNumberMissingError);
    });

    const expectAddContact = ({
      email = "pcriulan@gmail.com",
      firstName = "Pierre",
      lastName = "Criulanscy",
      phoneNumber = "0102030405",
    } = {}) => {
      const contactInformation = {
        email,
        firstName,
        lastName,
        phoneNumber,
      };
      return {
        async toThrow(errorConstructor) {
          const now = new Date();
          const restaurantId = "restaurant-id";
          const restaurantPublicKey = "restaurant-public-key";
          const restaurantRepository = createInMemoryRestaurantRepository({
            [restaurantId]: {
              publicKey: restaurantPublicKey,
              contacts: [],
            },
          });
          const encrypter = createIdentityEncrypter();
          const addContact = createAddContact({
            restaurantRepository,
            encrypter,
          });

          await expect(
            addContact({ restaurantId, contactInformation, now })
          ).rejects.toThrow(errorConstructor);
        },
      };
    };
  });
});
