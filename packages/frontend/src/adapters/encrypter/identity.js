export const createIdentityEncrypter = () => {
  let lastGeneratedPrivateKey, lastGeneratedPublicKey;
  return {
    generateKeyPair() {
      const key = `key${+new Date()}`;
      lastGeneratedPublicKey = `public${key}`;
      lastGeneratedPrivateKey = `private${key}`;
      return {
        privateKey: lastGeneratedPrivateKey,
        publicKey: lastGeneratedPublicKey,
      };
    },
    encrypt({ data, publicKey }) {
      return JSON.stringify({
        ...data,
        [`${publicKey}${lastGeneratedPrivateKey}`]: true,
      });
    },
    decrypt({ publicKey, privateKey, data }) {
      const {
        [`${publicKey}${privateKey}`]: _,
        ...theDecryptedData
      } = JSON.parse(data);
      return theDecryptedData;
    },
    getLastGeneratedKeyPair() {
      return {
        publicKey: lastGeneratedPublicKey,
        privateKey: lastGeneratedPrivateKey,
      };
    },
  };
};
