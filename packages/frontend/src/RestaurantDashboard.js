import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Spinner, Box, Heading, Text, Button } from "@chakra-ui/core";
import { AuthStateContext } from "./AuthContext";
import { SignUpForm } from "./SignUpForm";
import { ContactList } from "./ContactList";

export const RestaurantDashboard = ({
  addContact,
  getContacts,
  signUp,
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
          restorePrivateKey={restorePrivateKey}
          restaurantRepository={restaurantRepository}
        />
      </Box>
    );
  }
  return (
    <Box>
      <Heading textAlign="center">Resto Covid</Heading>
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
  backupPrivateKey: PropTypes.func.isRequired,
  restorePrivateKey: PropTypes.func.isRequired,
  restaurantRepository: PropTypes.shape({
    get: PropTypes.func.isRequired,
  }).isRequired,
  localDataRepository: PropTypes.shape({
    getPrivateKey: PropTypes.func.isRequired,
  }).isRequired,
};
