export const createLocalStorageDataRepository = () => {
  return {
    async savePrivateKey(privateKey) {
      return localStorage.setItem("privateKey", privateKey);
    },
    async getPrivateKey() {
      return localStorage.getItem("privateKey");
    },
  };
};
