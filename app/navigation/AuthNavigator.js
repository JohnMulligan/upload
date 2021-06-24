import React, { useState } from "react";
import { createStackNavigator } from '@react-navigation/stack';
import Connect from "../screens/Connect";
import {View, Text} from "react-native"
const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator mode = "card" headerMode = "none">
        <Stack.Screen name = "Connect" component = {Connect}/>
    </Stack.Navigator>
  );
}

export default AuthNavigator;