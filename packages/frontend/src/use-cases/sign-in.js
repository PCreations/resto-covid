export const createSignIn = ({ authenticationGateway }) => async ({
  email,
  password,
}) => {
  await authenticationGateway.signIn({ email, password });
};
