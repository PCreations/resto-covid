import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
} from "@chakra-ui/core";

const validateForm = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = "Champs requis";
  }
  if (!values.lastName) {
    errors.lastName = "Champs requis";
  }
  if (!values.email) {
    errors.email = "Champ requis";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Adresse e-mail invalide";
  }
  if (!values.phoneNumber) {
    errors.phoneNumber = "Champs requis";
  }
  return errors;
};

const sendContactInformation = ({
  addContact,
  restaurantId,
  notifyContactSent,
}) => async (values, { setSubmitting }) => {
  localStorage.setItem("firstName", values.firstName);
  localStorage.setItem("lastName", values.lastName);
  localStorage.setItem("email", values.email);
  localStorage.setItem("phoneNumber", values.phoneNumber);
  await addContact({
    restaurantId,
    contactInformation: {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
    },
    now: new Date(),
  });
  setSubmitting(false);
  notifyContactSent();
};

export const AddContactForm = ({ restaurantId, addContact }) => {
  const [contactSent, setContactSent] = useState(false);
  const notifyContactSent = useCallback(() => setContactSent(true), [
    setContactSent,
  ]);
  return contactSent ? (
    <Box bg="#48BB78" p={4} color="white">
      Merci ! Coordonnées bien envoyées.
    </Box>
  ) : (
    <Formik
      initialValues={{
        firstName: localStorage.getItem("firstName") || "",
        lastName: localStorage.getItem("lastName") || "",
        email: localStorage.getItem("email") || "",
        phoneNumber: localStorage.getItem("phoneNumber") || "",
      }}
      validate={validateForm}
      onSubmit={sendContactInformation({
        addContact,
        restaurantId,
        notifyContactSent,
      })}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <FormControl
            isRequired
            isInvalid={errors.firstName && touched.firstName}
            paddingBottom="1em"
          >
            <FormLabel htmlFor="first-name">Prénom</FormLabel>
            <Input
              type="text"
              id="first-name"
              name="firstName"
              aria-describedby="first-name-helper-text"
              value={values.firstName}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.firstName}</FormErrorMessage>
            <FormHelperText id="first-name-helper-text">
              Seul le restaurant aura accès à votre prénom.
            </FormHelperText>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.lastName && touched.lastName}
            paddingBottom="1em"
          >
            <FormLabel htmlFor="last-name">Nom</FormLabel>
            <Input
              type="text"
              id="last-name"
              name="lastName"
              aria-describedby="last-name-helper-text"
              value={values.lastName}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.lastName}</FormErrorMessage>
            <FormHelperText id="first-name-helper-text">
              Seul le restaurant aura accès à votre nom.
            </FormHelperText>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.email && touched.email}
            paddingBottom="1em"
          >
            <FormLabel htmlFor="email">E-mail</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              aria-describedby="email-helper-text"
              value={values.email}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
            <FormHelperText id="email-helper-text">
              Seul le restaurant aura accès à votre adresse e-mail.
            </FormHelperText>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.phoneNumber && touched.phoneNumber}
            paddingBottom="1em"
          >
            <FormLabel htmlFor="phone-number">Numéro de téléphone</FormLabel>
            <Input
              type="tel"
              id="phone-number"
              name="phoneNumber"
              aria-describedby="phone-number-helper-text"
              value={values.phoneNumber}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.phoneNumber}</FormErrorMessage>
            <FormHelperText id="first-name-helper-text">
              Seul le restaurant aura accès à votre numéro de téléphone.
            </FormHelperText>
          </FormControl>
          <Flex justify="center">
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Envoyer les coordonnées
            </Button>
          </Flex>
        </form>
      )}
    </Formik>
  );
};

AddContactForm.propTypes = {
  restaurantId: PropTypes.string.isRequired,
  addContact: PropTypes.func.isRequired,
};
