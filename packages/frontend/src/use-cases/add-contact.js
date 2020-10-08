import { ensureContactIsValid } from "../domain/ensure-contact-is-valid";

export const createAddContact = ({
  restaurantRepository,
  encrypter,
}) => async ({ restaurantId, contactInformation, now }) => {
  ensureContactIsValid(contactInformation);
  const { publicKey } = await restaurantRepository.get({ restaurantId });
  const encryptedContact = encrypter.encrypt({
    data: contactInformation,
    publicKey,
  });
  return restaurantRepository.addContact({
    restaurantId,
    now,
    encryptedContact,
  });
};
