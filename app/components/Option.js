import React from "react";
import { StyleSheet, View, ImageBackground, TouchableOpacity } from "react-native";
import Text from "./Text";

import colors from "../config/colors";

function Option({ text, description, onPress, selected, style, children }) {
  return (
    <TouchableOpacity
      style={[
        selected
          ? { borderColor: colors.primary, shadowColor: "black" }
          : { borderColor: colors.blue, shadowColor: "white" },
        { backgroundColor: colors.light },
        style,
        styles.box,
      ]}
      onPress={onPress}
    >
      <View style={{ width: "85%" }}>
        <Text
          style={{ fontSize: 18, color: colors.primary, marginBottom: 5 }}
          weight="medium"
        >
          {text}
        </Text>
        {description && (
          <Text style={{ color: colors.grey, fontSize: 14 }}>
            {description}
          </Text>
        )}
        {children}
      </View>
      <View style={styles.checkContainer}>
        {selected ? <ImageBackground source = {require('../config/Icons/check.png')} style={styles.check} /> : <View style = {styles.check}/>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
    padding: 20,
    minHeight: 150,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.65,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  checkContainer: {
    width: "15%",
    alignItems: "center",
  },
  check: {
    width: 25,
    height: 25,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default Option;
