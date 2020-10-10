export const createRestorePrivateKey = ({
  localDataRepository,
  restaurantRepository,
  encrypter,
}) => async ({ restaurantId, words }) => {
  const restaurant = await restaurantRepository.get({ restaurantId });
  const privateKey = encrypter.decryptPrivateKeyBackup({
    words,
    privateKeyBackup: restaurant.privateKeyBackup,
  });
  await localDataRepository.savePrivateKey(privateKey);
};
