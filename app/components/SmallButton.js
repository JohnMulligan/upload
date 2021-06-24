import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "./Text"

import colors from "../config/colors";

function SmallButton({ title, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style = {styles.text} weight = "bold">{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    width: 30,
  },
  text: {
    color: colors.primary,
    lineHeight: 24,
    fontSize: 24,
    textAlign: 'center'
  },
});

export default SmallButton;