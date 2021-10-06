import React, { useState, useEffect } from "react";
import { View, Image, Platform, ScrollView } from "react-native";
import Button from "../components/Button";
import ItemCard from "../components/ItemCard";
import ItemScreen from "../components/ItemScreen";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import Text from "../components/Text";
import { fetchItemData, getThumbnail } from "../../api/utils/Omeka";

import * as SecureStore from "expo-secure-store";

import colors from "../config/colors";

function ViewMode({ navigation, item }) {
  const [properties, setProperties] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);

  useEffect(() => {
    // console.log(route.params.item);
    SecureStore.getItemAsync("host").then((host) => {
      SecureStore.getItemAsync("keys").then((keys) => {
        fetchItemData(host, "items", item["o:id"], {
          key_identity: keys.split(",")[0],
          key_credential: keys.split(",")[1],
        })
          .then((res) => {
            console.log("res", res);
            if (loading == true) {
              setProperties(res);
              setLoading(false);
            }
          })
          .catch((error) => console.log("error", error));
      });
    });
  });

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.light }}
      exit={() => navigation.goBack()}
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <View
        style={{
          marginTop: 50,
          width: "85%",
        }}
      >
        <Text weight="italic" style={{ textAlign: "center" }}>
          Viewing
        </Text>
        <Text
          weight="bold"
          style={{ textAlign: "center", fontSize: 28, marginBottom: 20 }}
        >
          {item["o:title"]}
        </Text>
        <ScrollView style={{ height: "80%" }}>
          {loading ? (
            <Text>Loading fields...</Text>
          ) : (
            properties.map(
              (prop, idx) =>
                idx > 1 &&
                prop[0] != "Title" && (
                  <View style={{ marginVertical: 7.5 }} key={idx}>
                    <Text
                      style={{ fontSize: 18, marginBottom: 2 }}
                      weight="bold"
                    >
                      {prop[0]}
                    </Text>
                    <Text style={{ fontSize: 20 }}>{prop[1]}</Text>
                  </View>
                )
            )
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export default ViewMode;
