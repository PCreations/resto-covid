import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import {
  Spinner,
  Box,
  Flex,
  Text,
  List,
  ListItem,
  ListIcon,
  Button,
  Link,
} from "@chakra-ui/core";
import { RiContactsBookFill } from "react-icons/ri";
import { AiOutlineQrcode, AiOutlineExport } from "react-icons/ai";
import { AuthStateContext } from "./AuthContext";
import { SignUpForm } from "./SignUpForm";
import { ContactList } from "./ContactList";
import { Logo } from "./Logo";

export const RestaurantDashboard = ({
  addContact,
  getContacts,
  signUp,
  signOut,
  backupPrivateKey,
  restorePrivateKey,
  restaurantRepository,
  localDataRepository,
}) => {
  const { isAuthenticated, isAuthenticating } = useContext(AuthStateContext);
  const history = useHistory();

  if (isAuthenticating) {
    return <Spinner />;
  }
  if (isAuthenticated) {
    return (
      <Box>
        <ContactList
          addContact={addContact}
          getContacts={getContacts}
          signOut={signOut}
          restorePrivateKey={restorePrivateKey}
          restaurantRepository={restaurantRepository}
        />
      </Box>
    );
  }
  return (
    <Box>
      <Flex justifyContent="center" direction="column">
        <Logo />
        <List spacing={4} marginBottom="1.5em">
          <ListItem>
            <ListIcon icon={RiContactsBookFill} color="blue.500"></ListIcon>
            Resto Covid vous permet de mettre en place gratuitement votre cahier
            de rappel numérique qui répond aux{" "}
            <Link href="https://www.cnil.fr/fr/covid-19-et-les-cahiers-de-rappel-les-recommandations-de-la-cnil">
              exigences de la CNIL
            </Link>{" "}
            quant à la protection des données de vos clients.
          </ListItem>
          <ListItem>
            <ListIcon icon={AiOutlineQrcode} color="blue.500"></ListIcon>
            Enregistrez votre restaurant et bénéficiez d'un QR code à mettre à
            disposition de vos clients pour qu'ils puissent communiquer leurs
            informations de contact.
          </ListItem>
          <ListItem>
            <ListIcon icon={AiOutlineExport} color="blue.500"></ListIcon>
            En cas de détection de cluster, vous pouvez en un clic exporter les
            données des 14 derniers jours.
          </ListItem>
        </List>
      </Flex>
      <Box bg="teal.100" p={4} marginBottom={"1em"} marginTop={"1em"}>
        <Text textAlign="center">
          Si vous avez déjà un compte :{" "}
          <Button variantColor="teal" onClick={() => history.push("/signin")}>
            connectez-vous
          </Button>
        </Text>
      </Box>
      <SignUpForm
        signUp={signUp}
        backupPrivateKey={backupPrivateKey}
        getPrivateKey={localDataRepository.getPrivateKey}
      />
    </Box>
  );
};

RestaurantDashboard.propTypes = {
  addContact: PropTypes.func.isRequired,
  getContacts: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
  backupPrivateKey: PropTypes.func.isRequired,
  restorePrivateKey: PropTypes.func.isRequired,
  restaurantRepository: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
  localDataRepository: PropTypes.shape({
    getPrivateKey: PropTypes.func.isRequired,
  }).isRequired,
};
