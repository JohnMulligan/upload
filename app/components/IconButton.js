import React from "react";
import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import Text from "./Text";
import Icon from "./Icon";

import colors from "../config/colors";

function IconButton({ label, path, selected, direction, onPress, style }) {
  return (
    <TouchableOpacity onPress = {onPress} activeOpacity={selected && 1}>
      <Text weight = "italic" style={{ fontSize: 14, marginTop: 20 }}>{selected ? "selected" : " "}</Text>
      <View
        style={[
          {
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          },
          selected
            ? { backgroundColor: colors.primary }
            : { borderWidth: 2, borderColor: colors.primary },
        ]}
      >
        <Image
          style={{ width: 30, height: 30 }}
          source={
            label == "copy"
              ? require("../config/Icons/copy.png")
              : label == "edit"
              ? require("../config/Icons/edit.png")
              : require("../config/Icons/view.png")
          }
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 50,
    height: 50,
  },
  text: {
    color: colors.light,
    fontSize: 18,
  },
});

export default IconButton;
