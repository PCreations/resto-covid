const ONE_DAY_IN_MS = 24 * 3600 * 1000;

export const createInMemoryRestaurantRepository = (restaurantsById = {}) => {
  const restaurants = { ...restaurantsById };
  return {
    async save(restaurant) {
      restaurants[restaurant.id] = restaurant;
    },
    async addContact({ restaurantId, encryptedContact, now }) {
      restaurantsById[restaurantId].contacts.push({
        date: now,
        contact: encryptedContact,
      });
    },
    async get({ restaurantId }) {
      const { contacts: _, ...restaurant } = restaurants[restaurantId];
      return restaurant;
    },
    async getContacts({ restaurantId, today = new Date() }) {
      const fourteenDaysAgo = new Date(+today - 14 * ONE_DAY_IN_MS);
      return restaurants[restaurantId].contacts.filter(
        ({ date }) => new Date(date) >= fourteenDaysAgo
      );
    },
  };
};
