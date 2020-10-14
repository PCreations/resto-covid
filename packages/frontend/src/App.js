import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  CSSReset,
  Flex,
  Box,
  Heading,
  Spinner,
} from "@chakra-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import { createFirebaseAuthenticationGateway } from "./adapters/authentication-gateway";
import { createFirebaseRestaurantRepository } from "./adapters/restaurant-repository";
import { createLocalStorageDataRepository } from "./adapters/local-data-repository";
import { createSealedBoxEncrypter } from "./adapters/encrypter";
import { createQRCodeGenerator } from "./adapters/qr-code-generator";
import { createSignIn } from "./use-cases/sign-in";
import { createSignOut } from "./use-cases/sign-out";
import { createBackupPrivateKey } from "./use-cases/backup-private-key";
import { createRestorePrivateKey } from "./use-cases/restore-private-key";
import { createSignUp } from "./use-cases/sign-up";
import { createGetContacts } from "./use-cases/get-contacts";
import { createAddContact } from "./use-cases/add-contact";
import { AddContactForm } from "./AddContactForm";
import { RestaurantDashboard } from "./RestaurantDashboard";
import { SignUpForm } from "./SignUpForm";
import { AuthProvider } from "./AuthProvider";
import { SignInForm } from "./SignInForm";
import { Error as ErrorComponent } from "./Error";
import { captureException } from "./capture-exception";

const authenticationGateway = createFirebaseAuthenticationGateway();
const restaurantRepository = createFirebaseRestaurantRepository();
const localDataRepository = createLocalStorageDataRepository();
const qrCodeGenerator = createQRCodeGenerator();
const encrypter = createSealedBoxEncrypter();
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

const isSupportingLocalStorage = () => {
  try {
    localStorage.setItem("support", true);
    localStorage.removeItem("support");
    return true;
  } catch (e) {
    captureException(new Error("Local storage not supported"));
    return false;
  }
};

const App = () => {
  return (
    <AuthProvider authenticationGateway={authenticationGateway}>
      <ThemeProvider>
        <CSSReset />
        {isSupportingLocalStorage() ? (
          <Flex align="center" justify="center" padding="1em">
            <Router>
              <Switch>
                <Route exact path="/">
                  <RestaurantDashboard
                    localDataRepository={localDataRepository}
                    restaurantRepository={restaurantRepository}
                    addContact={addContact}
                    getContacts={getContacts}
                    signUp={signUp}
                    signOut={signOut}
                    restorePrivateKey={restorePrivateKey}
                    backupPrivateKey={backupPrivateKey}
                  />
                </Route>
                <Route exact path="/signup">
                  <SignUpForm
                    signUp={signUp}
                    backupPrivateKey={backupPrivateKey}
                    getPrivateKey={localDataRepository.getPrivateKey}
                  />
                </Route>
                <Route exact path="/signin">
                  <SignInForm signIn={signIn} />
                </Route>
                <Route path="/form/:restaurantId">
                  <Form />
                </Route>
                <Route path="*">
                  <div>404</div>
                </Route>
              </Switch>
            </Router>
          </Flex>
        ) : (
          <ErrorComponent message="Votre navigateur est trop vieux et pas assez sécurisé pour utiliser Resto Covid :(" />
        )}
      </ThemeProvider>
    </AuthProvider>
  );
};

const Form = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState();
  useEffect(() => {
    const getRestaurant = async () => {
      const restaurant = await restaurantRepository.get({ restaurantId });
      setRestaurant(restaurant);
    };
    getRestaurant();
  }, [setRestaurant, restaurantId]);
  return restaurant ? (
    <Box>
      <Heading textAlign="center" as="h1" size="md" marginBottom="1.5em">
        {restaurant.name}
      </Heading>
      <AddContactForm restaurant={restaurant} addContact={addContact} />
    </Box>
  ) : (
    <Spinner />
  );
};

export default App;
