import React, { useState, useEffect } from "react";
import { AuthStateContext, AuthSetStateContext } from "./AuthContext";

export const AuthProvider = ({ children, authenticationGateway }) => {
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
