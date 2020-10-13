import { BadCredentialsError } from "../../domain/errors";
import { auth as firebaseAuth } from "../shared/firebase";

export const createFirebaseAuthenticationGateway = () => {
  return {
    onRestaurantSignedIn(cb) {
      return firebaseAuth.onAuthStateChanged((user) => {
        cb(
          user
            ? {
                name: user.displayName,
                email: user.email,
                id: user.uid,
              }
            : null
        );
      });
    },
    onRestaurantSignedOut(cb) {
      return firebaseAuth.onAuthStateChanged((user) => {
        if (!user) cb(user);
      });
    },
    async createRestaurantUser({ restaurantName, email, password }) {
      return new Promise((resolve, reject) =>
        firebaseAuth
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) =>
            userCredential.user
              .updateProfile({ displayName: restaurantName })
              .then(() => userCredential.user.uid)
          )
          .then(resolve, reject)
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
    async signOut() {
      const userUnauthenticated = new Promise((resolve) => {
        const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
          if (!user) {
            unsubscribe();
            resolve();
          }
        });
      });
      return firebaseAuth.signOut().then(userUnauthenticated);
    },
    get currentRestaurantUser() {
      const user = firebaseAuth.currentUser;
      return user
        ? {
            name: user.displayName,
            email: user.email,
            id: user.uid,
          }
        : null;
    },
  };
};
