import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "./Text"

import colors from "../config/colors";

function SmallButton({ title, onPress, textStyle, style, ...otherProps}) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      {...otherProps}
    >
      <Text style = {[styles.text, textStyle]} weight = "bold">{title}</Text>
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
    minWidth: 30,
  },
  text: {
    paddingHorizontal: 5,
    color: colors.primary,
    lineHeight: 24,
    fontSize: 14,
    textAlign: 'center'
  },
});

export default SmallButton;