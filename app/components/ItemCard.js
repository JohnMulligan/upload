import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Dimensions, View } from "react-native";
import Text from "./Text";

import { getPropertiesInResourceTemplate } from "../../api/utils/Omeka";

const { width, height } = Dimensions.get("window");

import colors from "../config/colors";

function Card({
  title,
  id,
  data,
  baseAddress,
  onPress,
  color = "primary",
  style,
  children,
  ...otherProps
}) {
  const [properties, setProperties] = useState([]);

  // useEffect(() => {
  //   getPropertiesInResourceTemplate(baseAddress, id).then((res) => {
  //     setProperties[
  //       res.map((property) => <Text>{property.data["o:label"]}</Text>)
  //     ];
  //   });
  // });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      {...otherProps}
    >
      <View style={styles.header}>
        <Text weight="medium" style={styles.text}>
          {title}
        </Text>
      </View>
      <View style={styles.children}>{properties}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    borderColor: colors.blue,
    borderWidth: 2,
    width: 0.9 * width,
    marginBottom: 0.025 * height,
  },
  children: {
    alignItems: "center",
    margin: 0.01 * height,
    flexDirection: "row",
  },
  header: {
    marginTop: 0.01 * height,
    marginHorizontal: 0.01 * height,
  },
  text: {
    color: colors.primary,
    fontSize: 18,
  },
});

export default Card;
