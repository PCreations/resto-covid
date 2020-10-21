import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Box, Heading, Spinner } from "@chakra-ui/core";
import { DependenciesContext } from "../contexts/Dependencies";
import { createUseRestaurant } from "../hooks/use-restaurant";
import { AddContactForm } from "../AddContactForm";
import { NotFound } from "../NotFound";
import { captureException } from "../capture-exception";

export const Form = () => {
  const { restaurantId } = useParams();
  const { restaurantRepository, addContact } = useContext(DependenciesContext);
  const useRestaurant = createUseRestaurant({
    restaurantRepository,
    restaurantId,
    captureException,
  });
  const { error, restaurant, loading } = useRestaurant();

  if (error) {
    return <NotFound />;
  }
  return loading ? (
    <Spinner />
  ) : (
    <Box>
      <Heading textAlign="center" as="h1" size="md" marginBottom="1.5em">
        {restaurant.name}
      </Heading>
      <AddContactForm restaurant={restaurant} addContact={addContact} />
    </Box>
  );
};
