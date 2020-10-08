export const createIdentityEncrypter = ({
  nextGeneratedPrivateKey,
  nextGeneratedPublicKey,
} = {}) => ({
  generateKeyPair() {
    return {
      privateKey: nextGeneratedPrivateKey,
      publicKey: nextGeneratedPublicKey,
    };
  },
  encrypt({ data, publicKey }) {
    return JSON.stringify({ ...data, [publicKey]: true });
  },
});
