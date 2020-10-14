import React from "react";
import PropTypes from "prop-types";
import { Box } from "@chakra-ui/core";

export const Error = ({
  message = "Une erreur est survenue :( Essayez de rafraîchir la page !",
} = {}) => (
  <Box bg="red.500" color="white" p={4} textAlign="center">
    {message}
  </Box>
);

Error.propTypes = {
  message: PropTypes.string,
};
