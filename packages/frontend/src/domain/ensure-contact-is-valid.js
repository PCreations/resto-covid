export class EmailMissingError extends Error {}
export class InvalidEmailError extends Error {}
export class FirstNameMissingError extends Error {}
export class LastNameMissingError extends Error {}
export class PhoneNumberMissingError extends Error {}

export const ensureContactIsValid = (contactInformation) => {
  if (!contactInformation.email) {
    throw new EmailMissingError();
  }
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      contactInformation.email
    )
  ) {
    throw new InvalidEmailError();
  }
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
