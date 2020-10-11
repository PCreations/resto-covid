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
import { useLocation, useHistory } from "react-router-dom";
import { getAnalytics } from "./adapters/shared/firebase";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const validateForm = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = "Champs requis";
  }
  if (!values.lastName) {
    errors.lastName = "Champs requis";
  }
  if (!values.phoneNumber) {
    errors.phoneNumber = "Champs requis";
  }
  return errors;
};

const sendContactInformation = ({
  saveInputs,
  addContact,
  restaurantId,
  notifyContactSent,
}) => async (values, { setSubmitting }) => {
  if (saveInputs) {
    localStorage.setItem("firstName", values.firstName);
    localStorage.setItem("lastName", values.lastName);
    localStorage.setItem("phoneNumber", values.phoneNumber);
  }
  const contact = {
    firstName: values.firstName,
    lastName: values.lastName,
    phoneNumber: values.phoneNumber,
  };
  const now = new Date();
  await addContact({
    restaurantId,
    contactInformation: contact,
    now,
  });
  getAnalytics().logEvent("contact_added", {
    restaurantId,
  });
  setSubmitting(false);
  notifyContactSent({
    ...contact,
    date: now,
  });
};

export const AddContactForm = ({
  restaurantId,
  restaurantName,
  addContact,
  saveInputs = true,
}) => {
  const query = useQuery();
  const history = useHistory();
  const [contactSent, setContactSent] = useState(false);
  const notifyContactSent = useCallback(() => {
    setContactSent(true);
    console.log({ redirectToDashboard: query.get("redirectToDashboard") });
    if (query.get("redirectToDashboard") !== null) {
      history.push("/");
    }
  }, [setContactSent, query, history]);
  return contactSent ? (
    <Box bg="#48BB78" p={4} color="white">
      Merci ! Coordonnées bien envoyées.
    </Box>
  ) : (
    <Formik
      initialValues={{
        firstName: saveInputs ? localStorage.getItem("firstName") || "" : "",
        lastName: saveInputs ? localStorage.getItem("lastName") || "" : "",
        email: saveInputs ? localStorage.getItem("email") || "" : "",
        phoneNumber: saveInputs
          ? localStorage.getItem("phoneNumber") || ""
          : "",
      }}
      validate={validateForm}
      onSubmit={sendContactInformation({
        saveInputs,
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
          <FormHelperText marginTop="1em">
            Les informations recueillies sur ce formulaire sont enregistrées et
            utilisées uniquement par l'établissement{" "}
            <strong>"{restaurantName}"</strong>. Conformément aux obligations
            prévues dans le protocole sanitaire défini par arrêté préfectoral,
            vos données seront uniquement utilisées pour faciliter la recherche
            des « cas contacts » par les autorités sanitaires, et ne seront pas
            réutilisées à d’autres fins. En cas de contamination de l’un des
            clients au moment de votre présence, ces informations pourront être
            communiquées aux autorités sanitaires compétentes (agents des CPAM,
            de l’assurance maladie et/ou de l’agence régionale de santé), afin
            de vous contacter et de vous indiquer le protocole sanitaire à
            suivre. Vos données seront conservées pendant 14 jours à compter de
            leur collecte, et seront supprimées à l’issue de ce délai. Vous
            pouvez accéder aux données vous concernant, les rectifier ou exercer
            votre droit à la limitation du traitement de vos données. Pour
            exercer ces droits ou pour toute question sur le traitement de vos
            données, vous pouvez contacter l'établissement{" "}
            <strong>"{restaurantName}"</strong>. Si vous estimez, après les
            avoir contacté, que vos droits Informatique et Libertés ne sont pas
            respectés, vous pouvez adresser une réclamation à la CNIL.
          </FormHelperText>
        </form>
      )}
    </Formik>
  );
};

AddContactForm.propTypes = {
  restaurantId: PropTypes.string.isRequired,
  restaurantName: PropTypes.string.isRequired,
  addContact: PropTypes.func.isRequired,
  onContactAdded: PropTypes.func,
  saveInputs: PropTypes.bool,
};
