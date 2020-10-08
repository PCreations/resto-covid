export const createSignUp = ({
  authenticationGateway,
  restaurantRepository,
  encrypter,
  localDataRepository,
}) => async ({ restaurantName, email, password }) =>
  new Promise(async (resolve) => {
    const restaurantId = await authenticationGateway.createRestaurantUser({
      restaurantName,
      email,
      password,
    });
    const { privateKey, publicKey } = encrypter.generateKeyPair();
    const restaurant = {
      id: restaurantId,
      name: restaurantName,
      publicKey,
    };
    await localDataRepository.savePrivateKey(privateKey);
    await restaurantRepository.save(restaurant);
    resolve(restaurant);
  });
