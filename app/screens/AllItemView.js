import React, { useState } from "react";
import { View, Image, Platform } from "react-native";
import Button from "../components/Button";
import Screen from "../components/Screen";

function AllItemView({ navigation }) {

  return (
    <Screen
      back={() => navigation.goBack()}
      style={{ justifyContent: "center" }}
    >
     
    </Screen>
  );
}

export default AllItemView;
