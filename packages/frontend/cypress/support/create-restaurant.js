import { createFirebaseAuthenticationGateway } from "../../src/adapters/authentication-gateway";
import { createFirebaseRestaurantRepository } from "../../src/adapters/restaurant-repository";
import { createLocalStorageDataRepository } from "../../src/adapters/local-data-repository";
import { createSealedBoxEncrypter } from "../../src/adapters/encrypter";
import { createQRCodeGenerator } from "../../src/adapters/qr-code-generator";
import { createSignUp } from "../../src/use-cases/sign-up";
import { createSignOut } from "../../src/use-cases/sign-out";

export const createRestaurant = async () => {
  const now = +new Date();
  const restaurantUser = {
    email: `pcriulan+test${now}@gmail.com`,
    password: `pcriulan+test${now}@gmail.com`,
  };
  const authenticationGateway = createFirebaseAuthenticationGateway();
  const restaurantRepository = createFirebaseRestaurantRepository();
  const localDataRepository = createLocalStorageDataRepository();
  const encrypter = createSealedBoxEncrypter();
  const qrCodeGenerator = createQRCodeGenerator();
  const signUp = createSignUp({
    authenticationGateway,
    restaurantRepository,
    qrCodeGenerator,
    encrypter,
    localDataRepository,
  });
  const signOut = createSignOut({
    authenticationGateway,
  });
  const restaurant = await signUp({
    restaurantName: `Test Restaurant ${now}`,
    email: restaurantUser.email,
    password: restaurantUser.password,
    address: "address",
    postalCode: "75017",
    city: "Paris",
  });
  await signOut();
  return { restaurant, restaurantUser };
};
