import React from "react";
import { StyleSheet } from "react-native";

import Text from "./Text";

function ErrorMessage({ error, visible }) {
  if (visible) {
    return <Text style={styles.error}>{error}</Text>;
  }
  else {
    return null;
  }
}

const styles = StyleSheet.create({
  error: { color: "red", fontSize: 14, margin: 5 },
});

export default ErrorMessage;