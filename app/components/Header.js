import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Text from "./Text";

import defaultStyles from "../config/styles";

const { width, height } = Dimensions.get("window");

function Header({ title, body, style, ...otherProps }) {
  return (
    <Text weight="medium" style={style, styles.header}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    paddingLeft: 25,
    paddingTop: 25,
    paddingBottom: 10,
  },
});

export default Header;
