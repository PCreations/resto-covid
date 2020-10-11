export class FirstNameMissingError extends Error {}
export class LastNameMissingError extends Error {}
export class PhoneNumberMissingError extends Error {}

export const ensureContactIsValid = (contactInformation) => {
  if (!contactInformation.firstName) {
    throw new FirstNameMissingError();
  }
  if (!contactInformation.lastName) {
    throw new LastNameMissingError();
  }
  if (!contactInformation.phoneNumber) {
    throw new PhoneNumberMissingError();
  }
};
