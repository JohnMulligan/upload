import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewItem from "../screens/NewItem";
import ChooseUploadType from "../screens/ChooseUploadType";

import UploadMedia from "../screens/UploadMedia";
import Confirm from "../screens/Confirm";

import { View, Text, SafeAreaView } from "react-native";
import ItemContext from "../../api/auth/itemContext";

const Stack = createStackNavigator();

function CreateItemNavigator() {
  const [item, setItem] = useState("");

  return (
    <ItemContext.Provider value={{ item, setItem }}>
      <Stack.Navigator headerMode="none" mode="card">
        <Stack.Screen name="Create New Item" component={NewItem} />
        <Stack.Screen name="Choose Upload Type" component = {ChooseUploadType}/>
        <Stack.Screen name="Upload Media" component={UploadMedia} />
        <Stack.Screen name="Confirm" component={Confirm} />
      </Stack.Navigator>
    </ItemContext.Provider>
  );
}

export default CreateItemNavigator;
