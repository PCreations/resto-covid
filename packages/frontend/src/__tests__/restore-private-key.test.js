import faker from "faker";
import { createIdentityEncrypter } from "../adapters/encrypter";
import { createInMemoryLocalDataRepository } from "../adapters/local-data-repository";
import { createInMemoryRestaurantRepository } from "../adapters/restaurant-repository";
import { createRestorePrivateKey } from "../use-cases/restore-private-key";

describe("restorePrivateKey", () => {
  it("restores the private key from the public key and the 10 secret words", async () => {
    const localDataRepository = createInMemoryLocalDataRepository();
    const encrypter = createIdentityEncrypter();
    const {
      privateKey: theLostPrivateKey,
      publicKey,
    } = encrypter.generateKeyPair();
    const words = faker.random
      .words(10)
      .split(" ")
      .map((word) => word.toLowerCase())
      .join(" ");
    const privateKeyBackup = encrypter.encryptPrivateKeyBackup({
      words,
      privateKey: theLostPrivateKey,
    });
    const restaurant = {
      id: "restaurant-id",
      publicKey,
      privateKeyBackup,
    };
    const restaurantRepository = createInMemoryRestaurantRepository({
      [restaurant.id]: restaurant,
    });
    const restorePrivateKey = createRestorePrivateKey({
      localDataRepository,
      restaurantRepository,
      encrypter,
    });

    await restorePrivateKey({
      restaurantId: restaurant.id,
      words,
    });

    const restoredPrivateKey = await localDataRepository.getPrivateKey();
    expect(restoredPrivateKey).toEqual(theLostPrivateKey);
  });
});
