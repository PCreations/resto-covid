import { createIdentityEncrypter } from "../adapters/encrypter";
import { createInMemoryRestaurantRepository } from "../adapters/restaurant-repository";
import { createInMemoryAuthenticationGateway } from "../adapters/authentication-gateway";
import { createInMemoryLocalDataRepository } from "../adapters/local-data-repository";
import { createQRCodeGenerator } from "../adapters/qr-code-generator";
import { createSignUp } from "../use-cases/sign-up";

describe("signUp", () => {
  it("should create a new restaurant by saving its public key and saving the private key locally", async () => {
    expect.assertions(4);
    const restaurantId = "restaurant-id";
    const restaurantName = "My Restaurant";
    const password = "my-restaurant-password";
    const email = "myrestaurant@example.com";
    const authenticationGateway = createInMemoryAuthenticationGateway({
      getNextRestaurantId() {
        return restaurantId;
      },
    });
    const qrCodeGenerator = createQRCodeGenerator();
    const expectedQrCode = await qrCodeGenerator.generate({ restaurantId });
    const restaurantRepository = createInMemoryRestaurantRepository();
    const encrypter = createIdentityEncrypter();
    const localDataRepository = createInMemoryLocalDataRepository();
    const signUp = createSignUp({
      authenticationGateway,
      restaurantRepository,
      qrCodeGenerator,
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
    const { qrCode, ...restaurant } = await restaurantRepository.get({
      restaurantId,
    });
    const privateKey = await localDataRepository.getPrivateKey();
    expect(restaurant).toEqual({
      id: restaurantId,
      name: restaurantName,
      publicKey: restaurantPublicKey,
    });
    expect(qrCode).toEqual(expectedQrCode);
    expect(privateKey).toEqual(restaurantPrivateKey);
    expect(authenticationGateway.lastSignedUpRestaurant).toEqual({
      id: restaurantId,
      name: restaurantName,
      email,
      password,
    });
  });
});
