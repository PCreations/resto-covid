import React, { useState, useEffect, useContext } from "react";
import { DependenciesContext } from "./Dependencies";

export const AuthStateContext = React.createContext();
export const AuthSetStateContext = React.createContext(() => {});

export const AuthProvider = ({ children }) => {
  const { authenticationGateway } = useContext(DependenciesContext);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAuthenticating: true,
    currentRestaurantUser: {
      id: "",
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    authenticationGateway.onRestaurantSignedIn((currentRestaurantUser) => {
      setAuthState({
        isAuthenticated: currentRestaurantUser !== null,
        isAuthenticating: false,
        currentRestaurantUser: currentRestaurantUser || {},
      });
    });
  }, [setAuthState, authenticationGateway]);

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthSetStateContext.Provider value={setAuthState}>
        {children}
      </AuthSetStateContext.Provider>
    </AuthStateContext.Provider>
  );
};
