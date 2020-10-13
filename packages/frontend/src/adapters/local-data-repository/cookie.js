import { CookieStorage } from "cookie-storage";

const cookieStorage = new CookieStorage();

const TWO_YEARS_IN_MS = 3600 * 24 * 365 * 2 * 1000;

export const createCookieLocalDataRepository = () => ({
  async savePrivateKey(privateKey) {
    cookieStorage.setItem("privateKey", privateKey, {
      expires: new Date(+new Date() + TWO_YEARS_IN_MS),
    });
  },
  async getPrivateKey() {
    return cookieStorage.getItem("privateKey") || null;
  },
});
