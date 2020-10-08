export const createInMemoryLocalDataRepository = () => {
  let privateKey;
  return {
    getPrivateKey() {
      return privateKey;
    },
    savePrivateKey(thePrivateKey) {
      privateKey = thePrivateKey;
    },
  };
};
