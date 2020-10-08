import { auth as firebaseAuth } from "../../shared/firebase";
import { createFirebaseAuthenticationGateway } from "../../authentication-gateway";

describe("firebaseAuthenticationGateway", () => {
  it("creates a new firebase user", async (done) => {
    const restaurantName = "The Restaurant";
    const email = `restaurant${+new Date()}@email.com`;
    const password = "password-restaurant@email.com";
    const firebaseAuthenticationGateway = createFirebaseAuthenticationGateway();

    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        try {
          expect(user.email).toEqual(email);
        } finally {
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
});
