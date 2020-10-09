import { BadCredentialsError } from "../../domain/errors";
import { auth as firebaseAuth } from "../shared/firebase";

export const createFirebaseAuthenticationGateway = () => {
  return {
    async createRestaurantUser({ restaurantName, email, password }) {
      return new Promise((resolve) =>
        firebaseAuth
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) =>
            userCredential.user
              .updateProfile({ displayName: restaurantName })
              .then(() => userCredential.user.uid)
          )
          .then(resolve)
      );
    },
    async signIn({ password, email }) {
      const userAuthenticated = new Promise((resolve) => {
        const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
          if (user) {
            unsubscribe();
            resolve();
          }
        });
      });
      return firebaseAuth
        .signInWithEmailAndPassword(email, password)
        .catch(() => {
          throw new BadCredentialsError();
        })
        .then(userAuthenticated);
    },
    get currentRestaurantUser() {
      const user = firebaseAuth.currentUser;
      return {
        name: user.displayName,
        email: user.email,
        id: user.uid,
      };
    },
  };
};
