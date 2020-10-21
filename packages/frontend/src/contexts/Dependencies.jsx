import React from "react";
import { createSealedBoxEncrypter } from "../adapters/encrypter";
import { createFirebaseRestaurantRepository } from "../adapters/restaurant-repository";
import { createAddContact } from "../use-cases/add-contact";
import { createFirebaseAuthenticationGateway } from "../adapters/authentication-gateway";
import { createLocalStorageDataRepository } from "../adapters/local-data-repository";
import { createQRCodeGenerator } from "../adapters/qr-code-generator";
import { createSignIn } from "../use-cases/sign-in";
import { createSignOut } from "../use-cases/sign-out";
import { createBackupPrivateKey } from "../use-cases/backup-private-key";
import { createRestorePrivateKey } from "../use-cases/restore-private-key";
import { createSignUp } from "../use-cases/sign-up";
import { createGetContacts } from "../use-cases/get-contacts";

const restaurantRepository = createFirebaseRestaurantRepository();
const encrypter = createSealedBoxEncrypter();
const authenticationGateway = createFirebaseAuthenticationGateway();
const localDataRepository = createLocalStorageDataRepository();
const qrCodeGenerator = createQRCodeGenerator();
const signUp = createSignUp({
  authenticationGateway,
  restaurantRepository,
  encrypter,
  localDataRepository,
  qrCodeGenerator,
});
const backupPrivateKey = createBackupPrivateKey({
  restaurantRepository,
  localDataRepository,
  encrypter,
});
const restorePrivateKey = createRestorePrivateKey({
  localDataRepository,
  restaurantRepository,
  encrypter,
});
const signIn = createSignIn({ authenticationGateway });
const signOut = createSignOut({ authenticationGateway });
const getContacts = createGetContacts({
  encrypter,
  localDataRepository,
  restaurantRepository,
});
const addContact = createAddContact({
  restaurantRepository,
  encrypter,
});

export const DependenciesContext = React.createContext({
  restaurantRepository: createFirebaseRestaurantRepository(),
  encrypter,
  authenticationGateway,
  localDataRepository,
  qrCodeGenerator,
  signUp,
  backupPrivateKey,
  restorePrivateKey,
  signIn,
  signOut,
  getContacts,
  addContact,
});

export const DependenciesProvider = ({ children }) => (
  <DependenciesContext.Provider>{children}</DependenciesContext.Provider>
);
