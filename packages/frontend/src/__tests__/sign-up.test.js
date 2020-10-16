import { createInMemoryRestaurantRepository } from "../adapters/restaurant-repository";
import { createInMemoryAuthenticationGateway } from "../adapters/authentication-gateway";
import { createQRCodeGenerator } from "../adapters/qr-code-generator";
import { createSignUp } from "../use-cases/sign-up";

describe("signUp", () => {
  it("should create a new restaurant", async () => {
    expect.assertions(3);
    const restaurantId = "restaurant-id";
    const restaurantName = "My Restaurant";
    const password = "my-restaurant-password";
    const email = "myrestaurant@example.com";
    const address = "15 rue Dupont";
    const postalCode = "75017";
    const city = "Paris";
    const authenticationGateway = createInMemoryAuthenticationGateway({
      getNextRestaurantId() {
        return restaurantId;
      },
    });
    const qrCodeGenerator = createQRCodeGenerator();
    const expectedQrCode = await qrCodeGenerator.generate({ restaurantId });
    const restaurantRepository = createInMemoryRestaurantRepository();
    const signUp = createSignUp({
      authenticationGateway,
      restaurantRepository,
      qrCodeGenerator,
    });

    await signUp({
      restaurantName,
      email,
      password,
      address,
      postalCode,
      city,
    });

    const { qrCode, ...restaurant } = await restaurantRepository.get({
      restaurantId,
    });
    expect(restaurant).toEqual({
      id: restaurantId,
      name: restaurantName,
      address,
      postalCode,
      city,
    });
    expect(qrCode).toEqual(expectedQrCode);
    expect(authenticationGateway.lastSignedUpRestaurant).toEqual({
      id: restaurantId,
      name: restaurantName,
      email,
      password,
    });
  });
});
