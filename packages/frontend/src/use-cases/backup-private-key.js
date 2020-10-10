export const createBackupPrivateKey = ({
  restaurantRepository,
  localDataRepository,
  encrypter,
}) => async ({ restaurantId, words }) => {
  const privateKey = await localDataRepository.getPrivateKey();
  const restaurant = await restaurantRepository.get({ restaurantId });
  const privateKeyBackup = encrypter.encryptPrivateKeyBackup({
    words,
    privateKey,
  });
  await restaurantRepository.save({
    ...restaurant,
    privateKeyBackup,
  });
};
