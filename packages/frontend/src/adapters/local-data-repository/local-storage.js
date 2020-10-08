export const createLocalStorageDataRepository = () => {
  return {
    async savePrivateKey(privateKey) {
      localStorage.setItem("privateKey", privateKey);
    },
    async getPrivateKey() {
      localStorage.getItem("privateKey");
    },
  };
};
