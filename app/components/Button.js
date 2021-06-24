import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "./Text"

import colors from "../config/colors";

function Button({ title, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    padding: 15,
    width: '80%',
    height: 50
  },
  text: {
    color: colors.light,
    fontSize: 18,
    textAlign: 'center'
  },
});

export default Button;