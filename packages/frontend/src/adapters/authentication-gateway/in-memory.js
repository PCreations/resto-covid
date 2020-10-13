import { BadCredentialsError } from "../../domain/errors";

export const createInMemoryAuthenticationGateway = ({
  getNextRestaurantId,
  users = {},
  currentRestaurantUser = {},
} = {}) => {
  const signInListeners = [];
  const signOutListeners = [];
  let lastSignedUpRestaurant = {};
  let theCurrentRestaurantUser = currentRestaurantUser;
  return {
    onRestaurantSignedIn(cb) {
      signInListeners.push(cb);
    },
    onRestaurantSignedOut(cb) {
      signOutListeners.push(cb);
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
      theCurrentRestaurantUser = users[`${email}-${password}`];
      if (!theCurrentRestaurantUser) {
        throw new BadCredentialsError();
      }
      signInListeners.map((cb) => cb(theCurrentRestaurantUser));
    },
    async signOut() {
      theCurrentRestaurantUser = null;
      signOutListeners.map((cb) => cb(theCurrentRestaurantUser));
    },
    get lastSignedUpRestaurant() {
      return lastSignedUpRestaurant;
    },
    get currentRestaurantUser() {
      return theCurrentRestaurantUser;
    },
  };
};
