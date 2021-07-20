import React from "react";
import * as SecureStore from "expo-secure-store";

export function logOut(onLogOut) {
  SecureStore.deleteItemAsync("keys")
    .then(onLogOut)
    .catch((error) => console.log("error", error));
}
