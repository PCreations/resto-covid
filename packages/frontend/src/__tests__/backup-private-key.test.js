import faker from "faker";
import { createIdentityEncrypter } from "../adapters/encrypter";
import { createInMemoryLocalDataRepository } from "../adapters/local-data-repository";
import { createInMemoryRestaurantRepository } from "../adapters/restaurant-repository";
import { createBackupPrivateKey } from "../use-cases/backup-private-key";

describe("backupPrivateKey", () => {
  it("backups the private key with pass phrase composed of multiple random words", async () => {
    const encrypter = createIdentityEncrypter();
    const { privateKey, publicKey } = encrypter.generateKeyPair();
    const localDataRepository = createInMemoryLocalDataRepository({
      privateKey,
    });
    const restaurant = {
      id: "restaurant-id",
      publicKey,
    };
    const restaurantRepository = createInMemoryRestaurantRepository({
      [restaurant.id]: restaurant,
    });
    const backupPrivateKey = createBackupPrivateKey({
      localDataRepository,
      restaurantRepository,
      encrypter,
    });
    const words = faker.random
      .words(10)
      .split(" ")
      .map((word) => word.toLowerCase())
      .join(" ");

    await backupPrivateKey({ restaurantId: restaurant.id, words });

    const retrievedRestaurant = await restaurantRepository.get({
      restaurantId: restaurant.id,
    });
    expect(retrievedRestaurant.privateKeyBackup).toEqual(
      encrypter.encryptPrivateKeyBackup({
        words,
        privateKey,
      })
    );
  });
});
