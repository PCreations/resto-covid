import { createInMemoryAuthenticationGateway } from "../adapters/authentication-gateway";
import { createSignOut } from "../use-cases/sign-out";

describe("signOut", () => {
  it("signs out the restaurant", async (done) => {
    const restaurantUser = {
      id: "the-restaurant-id",
      name: "The Restaurant",
      email: "therestaurant@example.com",
    };
    const authenticationGateway = createInMemoryAuthenticationGateway({
      currentRestaurantUser: restaurantUser,
    });
    authenticationGateway.onRestaurantSignedOut(() => {
      expect(authenticationGateway.currentRestaurantUser).toEqual(null);
      done();
    });
    const signOut = createSignOut({ authenticationGateway });

    await signOut();
  });
});
