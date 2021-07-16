import React, {useContext} from "react";
import * as SecureStore from "expo-secure-store";
import AuthContext from "./context";

export function logOut(onLogOut) {
    SecureStore.deleteItemAsync("keys")
      .then(onLogOut)
      .catch((error) => console.log("error", error));
  }
