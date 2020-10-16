import faker from "faker";
import { createIdentityEncrypter } from "../adapters/encrypter";
import { createInMemoryLocalDataRepository } from "../adapters/local-data-repository/in-memory";
import { createInMemoryRestaurantRepository } from "../adapters/restaurant-repository";
import { createGetContacts } from "../use-cases/get-contacts";

const ONE_DAY_IN_MS = 24 * 3600 * 1000;

const xDaysOldDate = ({ today, days }) =>
  new Date(+today - ONE_DAY_IN_MS * days);

const getDaysAgo = ({ today }) => {
  const twoDaysAgo = xDaysOldDate({ today, days: 2 });
  const fiveDaysAgo = xDaysOldDate({ today, days: 5 });
  const fourteenDaysAgo = xDaysOldDate({ today, days: 14 });
  const fifteenDaysAgo = xDaysOldDate({ today, days: 15 });
  return {
    twoDaysAgo,
    fiveDaysAgo,
    fourteenDaysAgo,
    fifteenDaysAgo,
  };
};

const createFakeContactInformation = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
});

const createTestContactFactory = ({ encrypter, publicKey }) => ({ date }) => {
  const contactInformation = createFakeContactInformation();
  return {
    date,
    contact: encrypter.encrypt({
      data: contactInformation,
      publicKey,
    }),
    __rawContactInfomation__: contactInformation,
  };
};

const getTestData = ({ today }) => {
  const encrypter = createIdentityEncrypter();
  const {
    publicKey: restaurantPublicKey,
    privateKey: restaurantPrivateKey,
  } = encrypter.generateKeyPair();
  const restaurant = {
    id: "restaurant-id",
    name: "The Restaurant",
    publicKey: restaurantPublicKey,
  };
  const createTestContact = createTestContactFactory({
    encrypter,
    publicKey: restaurant.publicKey,
  });
  const {
    twoDaysAgo,
    fiveDaysAgo,
    fourteenDaysAgo,
    fifteenDaysAgo,
  } = getDaysAgo({ today });
  restaurant.contacts = [
    createTestContact({ date: twoDaysAgo }),
    createTestContact({ date: fiveDaysAgo }),
    createTestContact({ date: fourteenDaysAgo }),
    createTestContact({ date: fifteenDaysAgo }),
  ];
  const expectedContacts = restaurant.contacts
    .slice(0, 3)
    .map(({ date, __rawContactInfomation__ }) => ({
      date,
      contact: __rawContactInfomation__,
    }));

  return { restaurant, encrypter, restaurantPrivateKey, expectedContacts };
};

describe("getContacts", () => {
  it("gets the contacts from the 14 last days", async () => {
    const today = new Date();
    const {
      twoDaysAgo,
      fiveDaysAgo,
      fourteenDaysAgo,
      fifteenDaysAgo,
    } = getDaysAgo({ today });
    const contacts = [
      { date: twoDaysAgo, ...createFakeContactInformation() },
      { date: fiveDaysAgo, ...createFakeContactInformation() },
      { date: fourteenDaysAgo, ...createFakeContactInformation() },
      { date: fifteenDaysAgo, ...createFakeContactInformation() },
    ];
    const expectedContacts = contacts.slice(0, 3);
    const restaurant = {
      id: "restaurant-id",
      name: "The Restaurant",
      contacts,
    };
    const restaurantRepository = createInMemoryRestaurantRepository({
      [restaurant.id]: restaurant,
    });
    const getContacts = createGetContacts({
      restaurantRepository,
    });

    const retrievedContacts = await getContacts({
      restaurantId: restaurant.id,
      today,
    });

    expect(retrievedContacts).toEqual(expectedContacts);
  });

  it("(e2e encryption deprecated) gets the contacts from the 14 last days", async () => {
    const today = new Date();
    const {
      restaurant,
      expectedContacts,
      encrypter,
      restaurantPrivateKey,
    } = getTestData({ today });
    const localDataRepository = createInMemoryLocalDataRepository({
      privateKey: restaurantPrivateKey,
    });
    const restaurantRepository = createInMemoryRestaurantRepository({
      [restaurant.id]: restaurant,
    });
    const getContacts = createGetContacts({
      localDataRepository,
      restaurantRepository,
      encrypter,
    });

    const decryptedContacts = await getContacts({
      restaurantId: restaurant.id,
      today,
    });

    expect(decryptedContacts).toEqual(expectedContacts);
  });
});
