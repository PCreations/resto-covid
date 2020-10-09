import { BadCredentialsError } from "../../domain/errors";

export const createInMemoryAuthenticationGateway = ({
  getNextRestaurantId,
  users = {},
} = {}) => {
  let lastSignedUpRestaurant = {};
  let currentRestaurantUser;
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
    async signIn({ email, password }) {
      currentRestaurantUser = users[`${email}-${password}`];
      if (!currentRestaurantUser) {
        throw new BadCredentialsError();
      }
    },
    get lastSignedUpRestaurant() {
      return lastSignedUpRestaurant;
    },
    get currentRestaurantUser() {
      return currentRestaurantUser;
    },
  };
};
