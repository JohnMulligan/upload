import React, { useState, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AppNavigator from "./app/navigation/AppNavigator";
import AuthNavigator from "./app/navigation/AuthNavigator";

import AuthContext from "./api/auth/context.js";
import AppLoading from "expo-app-loading";
import * as SecureStore from "expo-secure-store";

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
  const [isReady, setIsReady] = useState(false);

  let [fontsLoaded] = useFonts({
    Barlow_300Light,
    Barlow_400Regular,
    Barlow_400Regular_Italic,
    Barlow_500Medium,
    Barlow_700Bold,
  });

  const restoreUser = async () => {
    try {
      SecureStore.getItemAsync("host")
        .then((host) =>
          SecureStore.getItemAsync("keys").then((keys) => {
            if (keys) setUser(true);
          })
        )
        .catch((error) => console.log("no user"));
    } catch (error) {
      console.log("No host address provided", error);
    }
  };

  if (!fontsLoaded || !isReady) {
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={(error) => console.log(error)}
      />
    );
  }

  return (
    <NavigationContainer>
      <AuthContext.Provider value={{ user, setUser }}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
