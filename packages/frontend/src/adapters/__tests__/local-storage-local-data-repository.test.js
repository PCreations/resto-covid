import { createLocalStorageDataRepository } from "../local-data-repository";

describe("localStorageLocalDataRepository", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  it("saves the private key in the local storage", async () => {
    const privateKey = "the-private-key";
    const localDataRepository = createLocalStorageDataRepository();

    await localDataRepository.savePrivateKey(privateKey);

    expect(localStorage.setItem).toHaveBeenLastCalledWith(
      "privateKey",
      privateKey
    );
  });

  it("retrieves the private key from the local storage", async () => {
    const expectedPrivateKey = "the-private-key";
    const localDataRepository = createLocalStorageDataRepository();
    await localDataRepository.savePrivateKey(expectedPrivateKey);

    await localDataRepository.getPrivateKey();

    expect(localStorage.getItem).toHaveBeenLastCalledWith("privateKey");
  });
});
