import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Text from "./Text";

import colors from "../config/colors";

const { width, height } = Dimensions.get("window");

function Modal({ title, color = "primary", children, style }) {
  return (
    <View style={[styles.modal, style]}>
      {title && (
        <Text weight="bold" style={styles.text}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    top: 0.4 * height,
    left: 0.05 * width,
    backgroundColor: colors.primary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    padding: 25,
    width: 0.9 * width,
    zIndex: 100,
  },
  text: {
    color: colors.blue,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Modal;
