const ONE_DAY_IN_MS = 24 * 3600 * 1000;

export const createInMemoryRestaurantRepository = (restaurantsById = {}) => {
  const restaurants = { ...restaurantsById };
  return {
    save(restaurant) {
      restaurants[restaurant.id] = restaurant;
    },
    addContact({ restaurantId, encryptedContact, now }) {
      restaurantsById[restaurantId].contacts.push({
        date: now,
        contact: encryptedContact,
      });
    },
    get({ restaurantId }) {
      return restaurants[restaurantId];
    },
    getContacts({ restaurantId, today = new Date() }) {
      const fourteenDaysAgo = new Date(+today - 14 * ONE_DAY_IN_MS);
      return restaurants[restaurantId].contacts.filter(
        ({ date }) => new Date(date) >= fourteenDaysAgo
      );
    },
  };
};
