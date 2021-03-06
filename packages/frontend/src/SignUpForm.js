import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { Redirect, Link } from "react-router-dom";
import {
  Box,
  Icon,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Flex,
  Input,
  Button,
  Spinner,
  Text,
} from "@chakra-ui/core";
import { getAnalytics } from "./adapters/shared/firebase";

const SIGNUP_WITH_ANOTHER_RESTAURANT_CONFIRMATION_TEXT = "CONFIRMATION";

const validateForm = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Champs requis";
  }
  if (!values.email) {
    errors.email = "Champ requis";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Adresse e-mail invalide";
  }
  if (!values.password) {
    errors.password = "Champs requis";
  }
  if (!values.passwordConfirmation) {
    errors.passwordConfirmation = "Champs requis";
  }
  if (
    values.password &&
    values.passwordConfirmation &&
    values.password !== values.passwordConfirmation
  ) {
    errors.passwordConfirmation = "Les mots de passe ne correspondent pas";
  }
  if (!values.address) {
    errors.address = "Champs requis";
  }
  if (!values.postalCode) {
    errors.postalCode = "Champs requis";
  }
  if (!values.city) {
    errors.postalCode = "Champs requis";
  }
  return errors;
};

const doSignUp = ({ signUp, notifySignUpSuccess }) => async (
  values,
  { setSubmitting, setStatus }
) => {
  try {
    await signUp({
      restaurantName: values.name,
      email: values.email,
      password: values.password,
      address: values.address,
      postalCode: values.postalCode,
      city: values.city,
    });
    window.fbq("track", "CompleteRegistration");
    getAnalytics().logEvent("sign_up", {
      restaurantName: values.name,
      email: values.email,
      address: values.address,
      postalCode: values.postalCode,
      city: values.city,
    });
    notifySignUpSuccess();
  } catch (err) {
    setStatus({
      error: err.message,
    });
  } finally {
    setSubmitting(false);
  }
};

export const SignUpForm = ({ signUp, getPrivateKey }) => {
  const [signupHasSucceed, setSignupHasSucceed] = useState(false);
  const [privateKey, setPrivateKey] = useState("loading");
  const [
    confirmationToSignUpWithAnotherRestaurant,
    setConfirmationToSignUpWithAnotherRestaurant,
  ] = useState(false);
  const notifySignUpSuccess = useCallback(() => {
    setSignupHasSucceed(true);
  }, [setSignupHasSucceed]);

  useEffect(() => {
    getPrivateKey().then(setPrivateKey);
  }, [getPrivateKey]);

  if (privateKey === "loading") {
    return <Spinner />;
  }

  if (privateKey !== null && !confirmationToSignUpWithAnotherRestaurant) {
    return (
      <Box>
        <Box bg="red.500" color="white" p={4}>
          <Flex alignItems="center">
            <Icon name="warning" size="2em" color="white" />
            <Text paddingLeft={5}>
              Cette appareil est déjà configuré pour un restaurant.
            </Text>
          </Flex>
          <Text paddingTop="2em">
            Si vous enregistrez un nouveau restaurant avec cet appareil, il sera
            impossible de récupérer les contacts du précédent restaurant sans
            renseigner la liste de mots aléatoire donnée à l'inscription.
          </Text>
          <Formik
            initialValues={{ confirmation: "" }}
            validate={(values) => {
              const errors = {};
              if (
                values.confirmation !==
                SIGNUP_WITH_ANOTHER_RESTAURANT_CONFIRMATION_TEXT
              ) {
                errors.confirmation = "Le texte ne correspond pas";
              }
              return errors;
            }}
            onSubmit={() => {
              setConfirmationToSignUpWithAnotherRestaurant(true);
            }}
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
                  isInvalid={errors.confirmation && touched.confirmation}
                >
                  <FormHelperText
                    id="confirmation-helper-text"
                    color="white"
                    paddingTop="1em"
                    paddingBottom="0.5em"
                  >
                    Entrez le mot CONFIRMATION pour confirmer l'enregistrement
                    d'un nouveau restaurant.
                  </FormHelperText>
                  <Input
                    color="black"
                    type="text"
                    id="confirmation"
                    name="confirmation"
                    aria-label="confirmation"
                    aria-describedby="confirmation-help-text"
                    value={values.confirmation}
                    onChange={handleChange}
                  />
                  <FormErrorMessage color="white">
                    {errors.confirmation}
                  </FormErrorMessage>
                </FormControl>
                <Flex justify="center">
                  <Button
                    mt={4}
                    variantColor="teal"
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Supprimer mon ancien restaurant
                  </Button>
                </Flex>
              </form>
            )}
          </Formik>
        </Box>
        <Text textAlign="center" marginTop="1em">
          <Link to="/">Retour à l'accueil</Link>
        </Text>
      </Box>
    );
  }

  return signupHasSucceed ? (
    <Redirect to="/" />
  ) : (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        address: "",
        postalCode: "",
        city: "Paris",
      }}
      validate={validateForm}
      onSubmit={doSignUp({
        signUp,
        notifySignUpSuccess,
      })}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
        status,
      }) => (
        <form onSubmit={handleSubmit}>
          {status?.error && (
            <Box bg="red.500" color="white" p={4}>
              <Text>Erreur : {status.error}</Text>
            </Box>
          )}
          <FormControl
            isRequired
            isInvalid={errors.name && touched.name}
            paddingBottom="1em"
          >
            <FormLabel htmlFor="name">Nom du restaurant</FormLabel>
            <Input
              type="text"
              id="name"
              name="name"
              aria-label="name"
              value={values.name}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
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
              aria-label="email"
              value={values.email}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.address && touched.address}
            paddingBottom="1em"
          >
            <FormLabel htmlFor="address">Adresse</FormLabel>
            <Input
              type="text"
              id="address"
              name="address"
              aria-label="address"
              value={values.address}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.address}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.postalCode && touched.postalCode}
            paddingBottom="1em"
          >
            <FormLabel htmlFor="postalCode">Code Postal</FormLabel>
            <Input
              type="text"
              id="postalCode"
              name="postalCode"
              aria-label="postalCode"
              value={values.postalCode}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.city && touched.city}
            paddingBottom="1em"
          >
            <FormLabel htmlFor="city">Ville</FormLabel>
            <Input
              type="text"
              id="city"
              name="city"
              aria-label="city"
              value={values.city}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.city}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={errors.password && touched.password}
            paddingBottom="1em"
          >
            <FormLabel htmlFor="password">Mot de passe</FormLabel>
            <Input
              type="password"
              id="password"
              name="password"
              aria-label="password"
              value={values.password}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              errors.passwordConfirmation && touched.passwordConfirmation
            }
            paddingBottom="1em"
          >
            <FormLabel htmlFor="passwordConfirmation">
              Confirmez le mot de passe
            </FormLabel>
            <Input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              aria-label="passwordConfirmation"
              value={values.passwordConfirmation}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.passwordConfirmation}</FormErrorMessage>
          </FormControl>
          <Flex justify="center">
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Enregistrer mon restaurant
            </Button>
          </Flex>
        </form>
      )}
    </Formik>
  );
};

SignUpForm.propTypes = {
  signUp: PropTypes.func.isRequired,
  backupPrivateKey: PropTypes.func.isRequired,
  getPrivateKey: PropTypes.func.isRequired,
};
