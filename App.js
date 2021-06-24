import React, { useState, useContext, useEffect } from "react";
import { Button, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";
import CreateItemNavigator from "./app/navigation/CreateItemNavigator";

import AuthContext from "./api/auth/context.js";
import AppLoading from "expo-app-loading";

const Stack = createStackNavigator();
import {
  useFonts,
  Barlow_300Light,
  Barlow_400Regular,
  Barlow_400Regular_Italic,
  Barlow_500Medium,
  Barlow_700Bold,
} from "@expo-google-fonts/barlow";

export default function App() {
  const [user, setUser] = useState(null);

  let [fontsLoaded] = useFonts({
    Barlow_300Light,
    Barlow_400Regular,
    Barlow_400Regular_Italic,
    Barlow_500Medium,
    Barlow_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <AuthContext.Provider value={{ user, setUser }}>
        {user ? <AppNavigator/> : <AuthNavigator />}
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
