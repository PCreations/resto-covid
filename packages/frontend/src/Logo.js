import React from "react";
import { Image } from "@chakra-ui/core";
import logo from "./logo.png";

export const Logo = () => (
  <Image src={logo} alt="Resto Covid" size={300} alignSelf="center" />
);
