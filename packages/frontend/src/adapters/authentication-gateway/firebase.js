import { auth as firebaseAuth } from "../shared/firebase";

export const createFirebaseAuthenticationGateway = () => {
  return {
    createRestaurantUser({ restaurantName, email, password }) {
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
  };
};
