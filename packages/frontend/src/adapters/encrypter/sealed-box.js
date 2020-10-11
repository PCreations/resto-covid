import CryptoJS from "crypto-js";
import { box, secretbox, randomBytes } from "tweetnacl";
import * as sealedBox from "tweetnacl-sealedbox-js";
import {
  encodeBase64,
  decodeBase64,
  encodeUTF8,
  decodeUTF8,
} from "tweetnacl-util";
import { DecryptBackupPrivateKeyError } from "../../domain/errors";

const generateKeyFromWords = (words) => {
  const hash = CryptoJS.SHA256(words);
  const buffer = Buffer.from(hash.toString(CryptoJS.enc.Hex), "hex");
  return new Uint8Array(buffer);
};

export const createSealedBoxEncrypter = () => {
  return {
    generateKeyPair() {
      const { publicKey, secretKey } = box.keyPair();
      return {
        publicKey: encodeBase64(publicKey),
        privateKey: encodeBase64(secretKey),
      };
    },
    encrypt({ publicKey, data }) {
      return encodeBase64(
        sealedBox.seal(
          decodeUTF8(JSON.stringify(data)),
          decodeBase64(publicKey)
        )
      );
    },
    encryptPrivateKeyBackup({ words, privateKey }) {
      const keyUint8Array = generateKeyFromWords(words);
      const nonce = randomBytes(secretbox.nonceLength);
      const privateKeyUint8 = decodeUTF8(privateKey);
      const box = secretbox(privateKeyUint8, nonce, keyUint8Array);
      const encryptedMessage = new Uint8Array(nonce.length + box.length);
      encryptedMessage.set(nonce);
      encryptedMessage.set(box, nonce.length);
      const base64FullMessage = encodeBase64(encryptedMessage);
      return base64FullMessage;
    },
    decrypt({ publicKey, privateKey, data }) {
      const decodedData = decodeBase64(data);
      const decodedPublicKey = decodeBase64(publicKey);
      const decodedPrivateKey = decodeBase64(privateKey);
      const decryptedData = sealedBox.open(
        decodedData,
        decodedPublicKey,
        decodedPrivateKey
      );
      const utf8data = encodeUTF8(decryptedData);
      return JSON.parse(utf8data);
    },
    decryptPrivateKeyBackup({ privateKeyBackup, words }) {
      const keyUint8Array = generateKeyFromWords(words);
      const privateKeyWithNonceAsUint8Array = decodeBase64(privateKeyBackup);
      const nonce = privateKeyWithNonceAsUint8Array.slice(
        0,
        secretbox.nonceLength
      );
      const encryptedPrivateKey = privateKeyWithNonceAsUint8Array.slice(
        secretbox.nonceLength,
        privateKeyBackup.length
      );
      const decryptedPrivateKey = secretbox.open(
        encryptedPrivateKey,
        nonce,
        keyUint8Array
      );
      if (!decryptedPrivateKey) {
        throw new DecryptBackupPrivateKeyError();
      }

      return encodeUTF8(decryptedPrivateKey);
    },
  };
};
