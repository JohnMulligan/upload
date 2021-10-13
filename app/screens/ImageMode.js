import React, { useState, useEffect } from "react";
import { View, Image, Platform, ScrollView } from "react-native";
import Button from "../components/Button";
import ItemCard from "../components/ItemCard";
import ItemScreen from "../components/ItemScreen";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import Text from "../components/Text";
import { fetchItemData, getThumbnail, getMedia } from "../../api/utils/Omeka";

import * as SecureStore from "expo-secure-store";

import colors from "../config/colors";

function ImageMode({ navigation, item, switchMode }) {
  const [properties, setProperties] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState();
  const [fields, setFields] = useState([]);
  const [host, setHost] = useState();
  const [media, setMedia] = useState([]);

  useEffect(() => {
    if (loading) {
      SecureStore.getItemAsync("host").then((host) => {
        setHost(host);
        SecureStore.getItemAsync("keys").then((keys) => {
          setKeys(keys);
          // getMedia(host, item["o:id"], keys)
          //   .then((res) => {
          //     console.log('res', res)
          //     setMedia(res);
          //     // setLoading(false);
          //   })
          //   .catch((error) => console.log("focus error", error));
          setLoading(false);
        });
      });
    }
  });

  const addPhoto = () => {
    navigation.navigate("Create Item", {
      screen: "Choose Upload Type",
      params: { item: item["o:id"] },
    });
  };
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
          Media in
        </Text>
        <Text
          weight="bold"
          style={{ textAlign: "center", fontSize: 28, marginBottom: 20 }}
        >
          {item["o:title"]}
        </Text>
        <ScrollView style={{ height: "80%" }}>
          {loading ? (
            <Text>Loading images...</Text>
          ) : (
            <>
              {media.map((med, idx) => (
                <>
                  <Text key={idx}>{med}</Text>

                  {/* <Image
                    source={{ uri: med["o:small"] }}
                    style={{ width: 10, height: 10 }}
                  /> */}
                </>
              ))}
              <Button onPress={() => addPhoto()} title="Add Media" />
              <Text>Loaded!</Text>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export default ImageMode;
