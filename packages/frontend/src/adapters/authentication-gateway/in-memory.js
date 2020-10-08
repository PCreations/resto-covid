export const createInMemoryAuthenticationGateway = ({
  getNextRestaurantId,
}) => {
  let lastSignedUpRestaurant = {};
  return {
    createRestaurantUser({ restaurantName, email, password }) {
      const id = getNextRestaurantId();
      lastSignedUpRestaurant = {
        id,
        name: restaurantName,
        email,
        password,
      };
      return id;
    },
    get lastSignedUpRestaurant() {
      return lastSignedUpRestaurant;
    },
  };
};
