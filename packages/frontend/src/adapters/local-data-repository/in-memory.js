export const createInMemoryLocalDataRepository = ({ privateKey } = {}) => {
  let _privateKey = privateKey;
  return {
    async getPrivateKey() {
      return _privateKey;
    },
    async savePrivateKey(thePrivateKey) {
      _privateKey = thePrivateKey;
    },
  };
};
