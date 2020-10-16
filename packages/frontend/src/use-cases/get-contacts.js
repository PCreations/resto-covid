import { MissingPrivateKeyError } from "../domain/errors";

export const createGetContacts = ({
  localDataRepository,
  restaurantRepository,
  encrypter,
}) => async ({ restaurantId, today }) => {
  const { publicKey } = await restaurantRepository.get({ restaurantId });
  if (publicKey) {
    const privateKey = await localDataRepository.getPrivateKey();
    if (!privateKey) {
      throw new MissingPrivateKeyError();
    }
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
  }
  return restaurantRepository.getContacts({ restaurantId, today });
};
