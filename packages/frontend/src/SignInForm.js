import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  Input,
  Button,
  Box,
  Heading,
} from "@chakra-ui/core";

const validateForm = (values) => {
  const errors = {};
  if (!values.email) {
    errors.email = "Champ requis";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = "Adresse e-mail invalide";
  }
  if (!values.password) {
    errors.password = "Champs requis";
  }
  return errors;
};

export const SignInForm = ({ signIn }) => {
  const history = useHistory();
  const onSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await signIn({ email: values.email, password: values.password });
      history.push("/");
    } catch (err) {
      setStatus({ error: "Mauvais identifiants" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validate={validateForm}
      onSubmit={onSubmit}
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
        <Box>
          <Heading as="h3" marginBottom="1em" textAlign="center">
            Connexion à votre espace restaurant
          </Heading>
          <form onSubmit={handleSubmit}>
            {status?.error && (
              <Box bg="red.500" color="white" p={4}>
                {status.error}
              </Box>
            )}
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
            <Flex justify="center">
              <Button
                mt={4}
                variantColor="teal"
                isLoading={isSubmitting}
                type="submit"
              >
                Connexion
              </Button>
            </Flex>
          </form>
        </Box>
      )}
    </Formik>
  );
};

SignInForm.propTypes = {
  signIn: PropTypes.func.isRequired,
};
