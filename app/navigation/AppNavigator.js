import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AllItemView from "../screens/AllItemView";
import Home from "../screens/Home";
import NewItem from "../screens/NewItem";
import FindAndEdit from "../screens/FindAndEdit";

import ViewMode from "../screens/ViewMode";
import EditMode from "../screens/EditMode";
import CopyMode from "../screens/CopyMode";

import { View, Text } from "react-native";

import CreateItemNavigator from "./CreateItemNavigator";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Create Item" component={CreateItemNavigator} />
      <Stack.Screen name="Edit Item" component={FindAndEdit} />
      <Stack.Screen name="View All Items" component={AllItemView} />
      <Stack.Screen name="View Mode" component={ViewMode} />
      <Stack.Screen name="Edit Mode" component={EditMode} />
      <Stack.Screen name="Copy Mode" component={CopyMode} />


    </Stack.Navigator>
  );
}

export default AppNavigator;
