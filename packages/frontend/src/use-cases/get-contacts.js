export const createGetContacts = ({
  localDataRepository,
  restaurantRepository,
  encrypter,
}) => async ({ restaurantId, today }) => {
  const privateKey = await localDataRepository.getPrivateKey();
  const encryptedContacts = restaurantRepository.getContacts({
    restaurantId,
    today,
  });
  return encryptedContacts.map(({ date, contact: encryptedContact }) => ({
    date,
    contact: encrypter.decrypt({ privateKey, data: encryptedContact }),
  }));
};
