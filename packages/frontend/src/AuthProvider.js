import React, { useState, useEffect } from "react";
import { AuthStateContext, AuthSetStateContext } from "./AuthContext";

export const AuthProvider = ({ children, authenticationGateway }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    currentRestaurantUser: {
      id: "",
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    authenticationGateway.onRestaurantSignedIn((currentRestaurantUser) => {
      setAuthState({
        isAuthenticated: true,
        currentRestaurantUser,
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
