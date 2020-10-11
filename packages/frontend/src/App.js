import React, { useState, useEffect, useContext } from "react";
import {
  ThemeProvider,
  CSSReset,
  Flex,
  Box,
  Heading,
  Spinner,
  Text,
} from "@chakra-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { createFirebaseAuthenticationGateway } from "./adapters/authentication-gateway";
import { createFirebaseRestaurantRepository } from "./adapters/restaurant-repository";
import { createLocalStorageDataRepository } from "./adapters/local-data-repository";
import { createSealedBoxEncrypter } from "./adapters/encrypter";
import { createQRCodeGenerator } from "./adapters/qr-code-generator";
import { createSignIn } from "./use-cases/sign-in";
import { createBackupPrivateKey } from "./use-cases/backup-private-key";
import { createRestorePrivateKey } from "./use-cases/restore-private-key";
import { createSignUp } from "./use-cases/sign-up";
import { createGetContacts } from "./use-cases/get-contacts";
import { createAddContact } from "./use-cases/add-contact";
import { AuthStateContext } from "./AuthContext";
import { AddContactForm } from "./AddContactForm";
import { SignUpForm } from "./SignUpForm";
import { ContactList } from "./ContactList";
import { AuthProvider } from "./AuthProvider";
import { SignInForm } from "./SignInForm";

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
const getContacts = createGetContacts({
  encrypter,
  localDataRepository,
  restaurantRepository,
});
const addContact = createAddContact({
  restaurantRepository,
  encrypter,
});

const App = () => {
  return (
    <AuthProvider authenticationGateway={authenticationGateway}>
      <ThemeProvider>
        <CSSReset />
        <Flex align="center" justify="center" padding="1em">
          <Box width={["100%", "75%", "50%"]}>
            <Router>
              <Switch>
                <Route exact path="/">
                  <RestaurantDashboard />
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
          </Box>
        </Flex>
      </ThemeProvider>
    </AuthProvider>
  );
};

const RestaurantDashboard = () => {
  const { isAuthenticated } = useContext(AuthStateContext);

  if (isAuthenticated) {
    return (
      <Box>
        <ContactList
          addContact={addContact}
          getContacts={getContacts}
          restorePrivateKey={restorePrivateKey}
          restaurantRepository={restaurantRepository}
        />
      </Box>
    );
  }
  return (
    <Box>
      <Heading textAlign="center">Resto Covid</Heading>
      <Text>
        Si vous avez déjà un compte : <Link to="/signin">connectez-vous</Link>
      </Text>
      <SignUpForm
        signUp={signUp}
        getPrivateKey={localDataRepository.getPrivateKey}
      />
    </Box>
  );
};

const Form = () => {
  const { restaurantId } = useParams();
  const [restaurantName, setRestaurantName] = useState();
  useEffect(() => {
    const getRestaurantName = async () => {
      const { name } = await restaurantRepository.get({ restaurantId });
      setRestaurantName(name);
    };
    getRestaurantName();
  }, [setRestaurantName, restaurantId]);
  return restaurantName ? (
    <Box>
      <Heading textAlign="center" as="h1" size="md" marginBottom="1.5em">
        {restaurantName}
      </Heading>
      <AddContactForm restaurantId={restaurantId} addContact={addContact} />
    </Box>
  ) : (
    <Spinner />
  );
};

export default App;
