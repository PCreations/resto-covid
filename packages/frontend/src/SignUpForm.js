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
  const notifySignUpSuccess = useCallback(() => setSignupHasSucceed(true), [
    setSignupHasSucceed,
  ]);

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
            impossible de récupérer les contacts du précédent restaurant.
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
      }}
      validate={validateForm}
      onSubmit={doSignUp({ signUp, notifySignUpSuccess })}
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
            <Box bg="red" color="white" p={4}>
              Erreur : {status.error}
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
              value={values.email}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
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
  getPrivateKey: PropTypes.func.isRequired,
};
