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
      return JSON.parse(
        encodeUTF8(
          sealedBox.open(
            decodeBase64(data),
            decodeBase64(publicKey),
            decodeBase64(privateKey)
          )
        )
      );
    },
  };
};
