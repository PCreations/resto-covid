import { createInMemoryAuthenticationGateway } from "../adapters/authentication-gateway";
import { createSignIn } from "../use-cases/sign-in";
import { BadCredentialsError } from "../domain/errors";

describe("signIn", () => {
  it("signs in the restaurant", async (done) => {
    const restaurantUser = {
      id: "the-restaurant-id",
      name: "The Restaurant",
      email: "therestaurant@example.com",
    };
    const restaurantUserPassword = "restaurant-password";
    const authenticationGateway = createInMemoryAuthenticationGateway({
      users: {
        "therestaurant@example.com-restaurant-password": restaurantUser,
      },
    });
    authenticationGateway.onRestaurantSignedIn((user) => {
      expect(user).toEqual(restaurantUser);
      expect(authenticationGateway.currentRestaurantUser).toEqual(
        restaurantUser
      );
      done();
    });
    const signIn = createSignIn({ authenticationGateway });

    await signIn({
      email: restaurantUser.email,
      password: restaurantUserPassword,
    });
  });

  it("fails with a BadCredentialsError if the wrong credentials are given", async () => {
    const authenticationGateway = createInMemoryAuthenticationGateway();
    const signIn = createSignIn({ authenticationGateway });

    await expect(
      signIn({ email: "email@example.com", password: "some-password" })
    ).rejects.toThrow(BadCredentialsError);
  });
});
