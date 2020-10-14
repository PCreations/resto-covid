import React from "react";
import { Flex, Text } from "@chakra-ui/core";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export const NotFound = () => (
  <Flex justifyContent="center" direction="column">
    <Link to="/">
      <Logo />
    </Link>
    <Text textAlign="center">Page non trouvée :(</Text>
    <Text textAlign="center" marginTop="2em">
      <Link to="/">Retour à l'accueil</Link>
    </Text>
  </Flex>
);
