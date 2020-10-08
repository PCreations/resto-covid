import { createIdentityEncrypter } from "../adapters/encrypter";
import { createInMemoryRestaurantRepository } from "../adapters/restaurant-repository";
import { createInMemoryAuthenticationGateway } from "../adapters/authentication-gateway";
import { createInMemoryLocalDataRepository } from "../adapters/local-data-repository";
import { createSignUp } from "../use-cases/sign-up";

describe("signUp", () => {
  it("should create a new restaurant by saving its public key and saving the private key locally", async () => {
    expect.assertions(3);
    const restaurantId = "restaurant-id";
    const restaurantName = "My Restaurant";
    const password = "my-restaurant-password";
    const email = "myrestaurant@example.com";
    const authenticationGateway = createInMemoryAuthenticationGateway({
      getNextRestaurantId() {
        return restaurantId;
      },
    });
    const restaurantRepository = createInMemoryRestaurantRepository();
    const encrypter = createIdentityEncrypter();
    const localDataRepository = createInMemoryLocalDataRepository();
    const signUp = createSignUp({
      authenticationGateway,
      restaurantRepository,
      encrypter,
      localDataRepository,
    });

    await signUp({
      restaurantName,
      email,
      password,
    });

    const {
      publicKey: restaurantPublicKey,
      privateKey: restaurantPrivateKey,
    } = encrypter.getLastGeneratedKeyPair();
    const restaurant = await restaurantRepository.get({ restaurantId });
    const privateKey = await localDataRepository.getPrivateKey();
    expect(restaurant).toEqual({
      id: restaurantId,
      name: restaurantName,
      publicKey: restaurantPublicKey,
    });
    expect(privateKey).toEqual(restaurantPrivateKey);
    expect(authenticationGateway.lastSignedUpRestaurant).toEqual({
      id: restaurantId,
      name: restaurantName,
      email,
      password,
    });
  });
});
