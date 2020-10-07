export const createInMemoryRestaurantRepository = (restaurantsById = {}) => {
  const restaurants = { ...restaurantsById };
  return {
    addContact({ restaurantId, encryptedContact, now }) {
      restaurantsById[restaurantId].contacts.push({
        date: now,
        contact: encryptedContact,
      });
    },
    get({ restaurantId }) {
      return restaurants[restaurantId];
    },
    getContacts({ restaurantId }) {
      return restaurants[restaurantId].contacts;
    },
  };
};
