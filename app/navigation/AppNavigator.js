import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AllItemView from "../screens/AllItemView";
import QuickStart from "../screens/QuickStart";
import NewItem from "../screens/NewItem";
import FindAndEdit from "../screens/FindAndEdit";
import { View, Text } from "react-native";

import CreateItemNavigator from "./CreateItemNavigator";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen name="Quick Start" component={QuickStart} />
      <Stack.Screen name="Create Item" component={CreateItemNavigator} />
      <Stack.Screen name="Find and Edit" component={FindAndEdit} />
      <Stack.Screen name="View All Items" component={AllItemView} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
