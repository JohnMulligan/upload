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

import { fetchItemData, getThumbnail } from "../../api/utils/Omeka";

const { width, height } = Dimensions.get("window");

import colors from "../config/colors";
import * as SecureStore from "expo-secure-store";

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
  const [loading, setLoading] = useState(true);
  const [thumbnail, setThumbnail] = useState("");

  useEffect(() => {
    SecureStore.getItemAsync("host").then((host) => {
      SecureStore.getItemAsync("keys").then((keys) => {
        fetchItemData(host, "items", id, {
          key_identity: keys.split(",")[0],
          key_credential: keys.split(",")[1],
        })
          .then((res) => {
            if (loading == true) {
              setProperties(res);
              setLoading(false);

              getThumbnail(host, id, keys).then((res) => setThumbnail(res));
            }
          })
          .catch((error) => console.log("error", error));
      });
    });
  });

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      {...otherProps}
    >
      <ScrollView style={{ paddingRight: 10, width: "100%" }}>
        <View style={styles.header}>
          <Text weight="medium" style={styles.text}>
            {title}
          </Text>
          {/* <Text weight="medium" style={styles.text}>
            ID: {id} 
          </Text> */}
        </View>
        <View>
          {!loading &&
            properties.map(
              (prop, idx) =>
                idx > 1 && (
                  <View key = {idx}>
                    <View style={styles.prop} key={idx}>
                      <View style={{ maxWidth: "50%" }}>
                        <Text style={{ fontSize: 18 }} weight="medium">
                          {prop[0]}
                        </Text>
                      </View>
                      <View style={{ maxWidth: "50%" }}>
                        <Text style={{ fontSize: 18, maxHeight: 20 }}>
                          {prop[1]}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
            )}
        </View>
      </ScrollView>
      <View style={styles.thumbnail}>
        {thumbnail ? (
          <Image
            source={{
              uri: thumbnail,
            }}
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
          />
        ) : <Text style = {{color: colors.primary, fontSize: 20}}>{id}</Text>}
      </View>
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
    height: 0.165 * height - 7.5,
    padding: 15,
    flexDirection: "row",
  },
  children: {
    alignItems: "center",
    margin: 0.01 * height,
    flexDirection: "row",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: "30%",
    height: "100%",
    borderRadius: 10,
    borderColor: colors.blue,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default Card;
