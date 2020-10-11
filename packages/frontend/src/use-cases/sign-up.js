export const createSignUp = ({
  authenticationGateway,
  restaurantRepository,
  qrCodeGenerator,
  encrypter,
  localDataRepository,
}) => async ({ restaurantName, email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const restaurantId = await authenticationGateway.createRestaurantUser({
        restaurantName,
        email,
        password,
      });
      const qrCode = await qrCodeGenerator.generate({ restaurantId });
      const { privateKey, publicKey } = encrypter.generateKeyPair();
      const restaurant = {
        id: restaurantId,
        name: restaurantName,
        publicKey,
        qrCode,
      };
      await localDataRepository.savePrivateKey(privateKey);
      await restaurantRepository.save(restaurant);
      resolve(restaurant);
    } catch (err) {
      reject(err);
    }
  });
