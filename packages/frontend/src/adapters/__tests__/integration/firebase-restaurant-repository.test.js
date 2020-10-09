import { db as firebaseDb, auth as firebaseAuth } from "../../shared/firebase";
import { createFirebaseRestaurantRepository } from "../../restaurant-repository";

const ONE_DAY_IN_MS = 24 * 3600 * 1000;

const testUser = {
  id: "tAxVeB9MjcQbExQvunDvFPIvXhW2",
  email: "pcriulan+testuser@gmail.com",
  password: "pcriulan+testuser@gmail.com",
};

describe("firebaseRestaurantRepository", () => {
  it("saves a restaurant", async (done) => {
    await firebaseAuth.signInWithEmailAndPassword(
      testUser.email,
      testUser.password
    );
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const restaurant = {
            id: testUser.id,
            name: "The Restaurant",
            publicKey: "the-public-key",
            qrCode: "some-qr-code-data",
          };
          const restaurantRepository = createFirebaseRestaurantRepository();

          await restaurantRepository.save(restaurant);

          const retrievedRestaurant = await restaurantRepository.get({
            restaurantId: restaurant.id,
          });
          expect(retrievedRestaurant).toEqual(restaurant);
        } finally {
          unsubscribe();
          await firebaseDb.collection("restaurants").doc(testUser.id).delete();
          done();
        }
      }
    });
  });

  it("adds a contact", async (done) => {
    await firebaseAuth.signInWithEmailAndPassword(
      testUser.email,
      testUser.password
    );
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        let contactIds = [];
        try {
          const now = new Date();
          const fifteenDaysAgo = new Date(+now - 15 * ONE_DAY_IN_MS);
          const restaurant = {
            id: testUser.id,
            name: "The Restaurant",
            publicKey: "the-public-key",
          };
          const restaurantRepository = createFirebaseRestaurantRepository();

          await restaurantRepository.save(restaurant);
          contactIds = await Promise.all([
            restaurantRepository.addContact({
              restaurantId: restaurant.id,
              encryptedContact: "encrypted contact",
              now,
            }),
            restaurantRepository.addContact({
              restaurantId: restaurant.id,
              encryptedContact: "other encrypted contact",
              now: fifteenDaysAgo,
            }),
          ]);

          const retrievedContacts = await restaurantRepository.getContacts({
            restaurantId: restaurant.id,
            today: now,
          });
          expect(retrievedContacts).toEqual([
            {
              date: now,
              contact: "encrypted contact",
            },
          ]);
        } finally {
          unsubscribe();
          await Promise.all([
            firebaseDb.collection("restaurants").doc(testUser.id).delete(),
            ...contactIds.map((contactId) =>
              firebaseDb
                .collection("restaurants")
                .doc(testUser.id)
                .collection("contacts")
                .doc(contactId)
                .delete()
            ),
          ]);
          done();
        }
      }
    });
  });
});
