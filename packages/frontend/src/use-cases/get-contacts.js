export const createGetContacts = ({
  localDataRepository,
  restaurantRepository,
  encrypter,
}) => async ({ restaurantId, today }) => {
  const { publicKey } = await restaurantRepository.get({ restaurantId });
  const privateKey = await localDataRepository.getPrivateKey();
  const encryptedContacts = await restaurantRepository.getContacts({
    restaurantId,
    today,
  });
  return encryptedContacts.map(({ date, contact: encryptedContact }) => ({
    date,
    contact: encrypter.decrypt({
      privateKey,
      publicKey,
      data: encryptedContact,
    }),
  }));
};
