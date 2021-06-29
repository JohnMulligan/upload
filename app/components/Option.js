import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Text from "./Text";

import colors from "../config/colors";

function Option({ text, onPress, selected, style }) {
  return (
    <View style={(style, styles.container)}>
      {selected ? (
        <Text weight="medium">{text}</Text>
      ) : (
        <Text style={{ color: colors.primary }}>{text}</Text>
      )}
      <TouchableOpacity
        style={[selected && {backgroundColor: colors.primary}, styles.select]}
        onPress={onPress}
      ></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20
  },
  select: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: colors.primary,
    borderWidth: 2,
  },
});

export default Option;
