import faker from "faker";
import { DecryptBackupPrivateKeyError } from "../../domain/errors";
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

  it("can decrypt a privateKeyBackup with the words", () => {
    const encrypter = createSealedBoxEncrypter();
    const { privateKey: lostPrivateKey } = encrypter.generateKeyPair();
    const words = faker.random.words(10).toLowerCase();
    const privateKeyBackup = encrypter.encryptPrivateKeyBackup({
      words,
      privateKey: lostPrivateKey,
    });

    const decrypedPrivateKey = encrypter.decryptPrivateKeyBackup({
      privateKeyBackup,
      words,
    });

    expect(decrypedPrivateKey).toEqual(lostPrivateKey);
  });

  it("throw a DecryptBackupPrivateKeyError if it fails to decrypt a privateKeyBackup with the words", () => {
    const encrypter = createSealedBoxEncrypter();
    const { privateKey: lostPrivateKey } = encrypter.generateKeyPair();
    const words = faker.random.words(10).toLowerCase();
    const wrongWords = faker.random.words(10).toLowerCase();
    const privateKeyBackup = encrypter.encryptPrivateKeyBackup({
      words,
      privateKey: lostPrivateKey,
    });

    expect(() =>
      encrypter.decryptPrivateKeyBackup({
        privateKeyBackup,
        words: wrongWords,
      })
    ).toThrow(DecryptBackupPrivateKeyError);
  });
});
