import { box } from "tweetnacl";
import * as sealedBox from "tweetnacl-sealedbox-js";
import {
  encodeBase64,
  decodeBase64,
  encodeUTF8,
  decodeUTF8,
} from "tweetnacl-util";

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
    decrypt({ publicKey, privateKey, data }) {
      const decodedData = decodeBase64(data);
      const decodedPublicKey = decodeBase64(publicKey);
      const decodedPrivateKey = decodeBase64(privateKey);
      const decryptedData = sealedBox.open(
        decodedData,
        decodedPublicKey,
        decodedPrivateKey
      );
      debugger;
      const utf8data = encodeUTF8(decryptedData);
      return JSON.parse(utf8data);
    },
  };
};
