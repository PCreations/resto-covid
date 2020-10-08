export const createInMemoryLocalDataRepository = ({ privateKey } = {}) => {
  let _privateKey = privateKey;
  return {
    getPrivateKey() {
      return _privateKey;
    },
    savePrivateKey(thePrivateKey) {
      _privateKey = thePrivateKey;
    },
  };
};
