import React, { useState, useEffect, useContext } from "react";
import {
  ThemeProvider,
  CSSReset,
  Flex,
  Box,
  Heading,
  Spinner,
  Text,
  Image,
} from "@chakra-ui/core";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Link,
} from "react-router-dom";
import { createFirebaseAuthenticationGateway } from "./adapters/authentication-gateway";
import { createFirebaseRestaurantRepository } from "./adapters/restaurant-repository";
import { createLocalStorageDataRepository } from "./adapters/local-data-repository";
import { createSealedBoxEncrypter } from "./adapters/encrypter";
import { createQRCodeGenerator } from "./adapters/qr-code-generator";
import { createSignIn } from "./use-cases/sign-in";
import { createSignUp } from "./use-cases/sign-up";
import { createGetContacts } from "./use-cases/get-contacts";
import { createAddContact } from "./use-cases/add-contact";
import { AuthStateContext } from "./AuthContext";
import { AddContactForm } from "./AddContactForm";
import { SignUpForm } from "./SignUpForm";
import { SignInForm } from "./SignInForm";
import { AuthProvider } from "./AuthProvider";

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
                    getPrivateKey={localDataRepository.getPrivateKey}
                  />
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
        <ContactList />
      </Box>
    );
  }
  return (
    <div>
      <Heading textAlign="center">Resto Covid</Heading>
      <SignInForm signIn={signIn} />
      <Text textAlign="center" marginTop="1em">
        <Link to="/signup">
          Pas de compte ? Enregistrez votre restaurant en 30 secondes
        </Link>
      </Text>
    </div>
  );
};

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [restaurant, setRestaurant] = useState();

  useEffect(() => {
    const retrieveContacts = async () => {
      const { id: restaurantId } = authenticationGateway.currentRestaurantUser;
      const contacts = await getContacts({
        restaurantId,
        today: new Date(),
      });
      setContacts(contacts);
    };
    retrieveContacts();
  }, [setContacts]);

  useEffect(() => {
    const retrieveRestaurant = async () => {
      const { id: restaurantId } = authenticationGateway.currentRestaurantUser;
      const restaurant = await restaurantRepository.get({ restaurantId });
      console.log({ restaurant });
      setRestaurant(restaurant);
    };
    retrieveRestaurant();
  }, [setRestaurant]);

  return (
    <Box>
      {restaurant ? (
        <Box>
          <Heading>Dashboard : {restaurant.name}</Heading>
          <Image src={restaurant.qrCode} />
        </Box>
      ) : (
        <Spinner />
      )}
      {contacts ? JSON.stringify(contacts, null, 2) : <Spinner />}
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
