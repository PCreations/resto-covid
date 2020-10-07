export const createIdentityEncrypter = () => ({
  encrypt({ data, publicKey }) {
    return JSON.stringify({ ...data, [publicKey]: true });
  },
});
