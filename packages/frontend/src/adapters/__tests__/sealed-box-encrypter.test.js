import { createSealedBoxEncrypter } from "../encrypter";

describe("sealedBoxEncrypter", () => {
  it("can decrypt with a private key what was encrypted with a public key", () => {
    const encrypter = createSealedBoxEncrypter();
    const { publicKey, privateKey } = encrypter.generateKeyPair();
    const theData = { foo: "bar" };
    const encryptedData = encrypter.encrypt({ publicKey, data: theData }); //?

    const decryptedData = encrypter.decrypt({
      publicKey,
      privateKey,
      data: encryptedData,
    });

    expect(decryptedData).toEqual(theData);
  });
});
