import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
  ScrollView,
} from "react-native";
import Text from "./Text";

import {
  fetchItemData,
  getThumbnail,
  getResourceTemplate,
} from "../../api/utils/Omeka";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

import colors from "../config/colors";
import * as SecureStore from "expo-secure-store";

function Card({
  title,
  id,
  keys,
  data,
  baseAddress,
  onPress,
  color = "primary",
  style,
  children,
  ...otherProps
}) {
  const [properties, setProperties] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [resourceTemplate, setResourceTemplate] = useState("");

  useEffect(() => {
    SecureStore.getItemAsync("host").then((host) => {
      SecureStore.getItemAsync("keys").then((keys) => {
        getThumbnail(host, id, keys).then((res) => {
          setThumbnail(res);
        });
        if (data["o:resource_template"] != null) {
          // console.log(data["o:resource_template"]["o:id"]);
          getResourceTemplate(host, data["o:resource_template"]["o:id"]).then(
            (res) => setResourceTemplate(res.data["o:label"])
          );
        }
      });
    });
    // console.log("data", data["o:resource_template"]);
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      {...otherProps}
    >
      <View style={styles.header}>
        <View style={{ justifyContent: "space-between" }}>
          <View style={{ maxHeight: "50%" }}>
            <Text weight="bold" style={styles.text}>
              {title}
            </Text>
          </View>
          <Text style={{ color: colors.primary }} weight="medium">
            {resourceTemplate}
          </Text>
        </View>
      </View>
      <View style={styles.thumbnail}>
        {thumbnail ? (
          <Image
            source={{
              uri: thumbnail,
            }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Text style={{ color: colors.primary, fontSize: 20 }}>{id}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 0.9 * width,
    flexWrap: "wrap",
    marginBottom: 0.025 * height,
    height: 0.165 * height - 7.5,
    flexDirection: "row",
    paddingHorizontal: 3
  },
  children: {
    alignItems: "center",
    margin: 0.01 * height,
    flexDirection: "row",
  },
  header: {
    flexDirection: "row",
    width: "65%",
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderColor: colors.primary,
    borderWidth: 2,
    padding: 15,
    justifyContent: "space-between",
    shadowColor: "#000",
    backgroundColor: colors.light,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  text: {
    color: colors.primary,
    fontSize: 22,
  },
  prop: {
    flexDirection: "row",
    marginBottom: 2,
    justifyContent: "space-between",
    width: "100%",
    overflow: "scroll",
  },
  thumbnail: {
    width: "32.5%",
    height: "100%",
    borderColor: colors.primary,
    marginLeft: "2.5%",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    backgroundColor: colors.light,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

export default Card;
