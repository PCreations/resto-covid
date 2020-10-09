import { db as firebaseDb } from "../shared/firebase";
import * as firebase from "firebase";

const ONE_DAY_IN_MS = 24 * 3600 * 1000;

export const createFirebaseRestaurantRepository = () => {
  return {
    async save(restaurant) {
      return firebaseDb
        .collection("restaurants")
        .doc(restaurant.id)
        .set(restaurant);
    },
    async get({ restaurantId }) {
      return firebaseDb
        .collection("restaurants")
        .doc(restaurantId)
        .get()
        .then((doc) => {
          const { id, name, publicKey, qrCode } = doc.data();
          return {
            id,
            name,
            publicKey,
            qrCode,
          };
        });
    },
    async addContact({ restaurantId, encryptedContact, now }) {
      return firebaseDb
        .collection("restaurants")
        .doc(restaurantId)
        .collection("contacts")
        .add({
          date: firebase.firestore.Timestamp.fromDate(now),
          contact: encryptedContact,
        })
        .then((contact) => contact.id);
    },
    async getContacts({ restaurantId, today = new Date() }) {
      const fourteenDaysAgo = new Date(+today - 14 * ONE_DAY_IN_MS);
      return firebaseDb
        .collection("restaurants")
        .doc(restaurantId)
        .collection("contacts")
        .where("date", ">=", fourteenDaysAgo)
        .get()
        .then((querySnapshot) => {
          const contacts = [];
          querySnapshot.forEach((doc) => {
            const { date: firebaseTimestamp, contact } = doc.data();
            contacts.push({
              date: firebaseTimestamp.toDate(),
              contact,
            });
          });
          return contacts;
        });
    },
  };
};
