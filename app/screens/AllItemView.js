import React, { useState } from "react";
import { View, Image, Text, Platform } from "react-native";
import Button from "../components/Button";
import ItemScreen from "../components/ItemScreen";

function AllItemView({ navigation }) {

  return (
    <ItemScreen exit={() => navigation.goBack()} style={{ flex: 1, padding: 15, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Sorry, this feature isn't available yet.</Text>
    </ItemScreen>
  );
}

export default AllItemView;
