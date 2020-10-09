import { BadCredentialsError } from "../../domain/errors";

export const createInMemoryAuthenticationGateway = ({
  getNextRestaurantId,
  users = {},
} = {}) => {
  let listeners = [];
  let lastSignedUpRestaurant = {};
  let currentRestaurantUser;
  return {
    onRestaurantSignedIn(cb) {
      listeners.push(cb);
    },
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
      listeners.map((cb) => cb(currentRestaurantUser));
    },
    get lastSignedUpRestaurant() {
      return lastSignedUpRestaurant;
    },
    get currentRestaurantUser() {
      return currentRestaurantUser;
    },
  };
};
