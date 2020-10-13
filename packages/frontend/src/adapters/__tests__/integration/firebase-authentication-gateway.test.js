import { auth as firebaseAuth } from "../../shared/firebase";
import { createFirebaseAuthenticationGateway } from "../../authentication-gateway";
import { BadCredentialsError } from "../../../domain/errors";

describe.only("firebaseAuthenticationGateway", () => {
  it("creates a new firebase user", async (done) => {
    const restaurantName = "The Restaurant";
    const email = `restaurant${+new Date()}@email.com`;
    const password = "password-restaurant@email.com";
    const firebaseAuthenticationGateway = createFirebaseAuthenticationGateway();

    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        try {
          expect(user.email).toEqual(email);
        } finally {
          unsubscribe();
          user.delete().then(done);
        }
      }
    });

    const id = await firebaseAuthenticationGateway.createRestaurantUser({
      restaurantName,
      email,
      password,
    });
    expect(id).toBeDefined();
  });

  it("returns null as the current user if the restaurant is not signed in", () => {
    const firebaseAuthenticationGateway = createFirebaseAuthenticationGateway();

    expect(firebaseAuthenticationGateway.currentRestaurantUser).toBeNull();
  });

  it("signs in a user", async (done) => {
    const restaurantName = "The Restaurant";
    const email = `restaurant${+new Date()}@email.com`;
    const password = "password-restaurant@email.com";
    const firebaseAuthenticationGateway = createFirebaseAuthenticationGateway();
    const userId = await firebaseAuthenticationGateway.createRestaurantUser({
      restaurantName,
      email,
      password,
    });

    firebaseAuthenticationGateway.onRestaurantSignedIn((user) => {
      try {
        expect(user).toEqual({
          name: restaurantName,
          email,
          id: userId,
        });
        expect(firebaseAuthenticationGateway.currentRestaurantUser).toEqual(
          user
        );
      } finally {
        firebaseAuth.currentUser.delete().then(done);
      }
    });

    await firebaseAuthenticationGateway.signIn({ email, password });
  });

  it.only("signs out a user", (done) => {
    const firebaseAuthenticationGateway = createFirebaseAuthenticationGateway();
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const unsub = firebaseAuthenticationGateway.onRestaurantSignedOut(
          () => {
            expect(firebaseAuthenticationGateway.currentRestaurantUser).toBe(
              null
            );
            unsubscribe();
            unsub();
            done();
          }
        );
        await firebaseAuthenticationGateway.signOut();
      }
    });
    firebaseAuth.signInWithEmailAndPassword(
      "pcriulan+testuser@gmail.com",
      "pcriulan+testuser@gmail.com"
    );
  });

  it("throw a BadCredentialsError if the given credentials are wrong", async () => {
    const email = `restaurant${+new Date()}@email.com`;
    const password = "password-restaurant@email.com";
    const firebaseAuthenticationGateway = createFirebaseAuthenticationGateway();

    await expect(
      firebaseAuthenticationGateway.signIn({ email, password })
    ).rejects.toThrow(BadCredentialsError);
  });
});
