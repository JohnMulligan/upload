import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import ItemCard from "../components/ItemCard";
import ItemScreen from "../components/ItemScreen";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import Text from "../components/Text";
import { getMedia, getImage } from "../../api/utils/Omeka";

const { width, height } = Dimensions.get("window");

import { useFocusEffect } from "@react-navigation/native";

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

  const [mediaLength, setMediaLength] = useState();
  const [interval, setInterval] = useState([]);

  useFocusEffect(() => {
    if (loading) {
      SecureStore.getItemAsync("host").then((host) => {
        setHost(host);
        SecureStore.getItemAsync("keys").then((keys) => {
          params = {
            key_identity: keys.split(",")[0],
            key_credential: keys.split(",")[1],
          };
          setKeys(keys);
          getMedia(host, item["o:id"], params)
            .then((res) => {
              var med = [
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
                "",
              ];
              var completedGettingImages = 0;
              if (res.length < 13) setInterval(res);
              else setInterval(res.slice(0, 13));
              setMediaLength(res.length);
              if (res.length == 0) setLoading(false);
              interval.map((id, idx) => {
                getImage(host, id["o:id"], params).then((img) => {
                  med[idx] = img;
                  completedGettingImages++;
                  if (completedGettingImages == interval.length) {
                    setLoading(false);
                    setMedia(med);
                  }
                });
              });
            })
            .catch((error) => console.log("focus error", error));
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
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {media &&
                media.map((med, idx) =>
                  med ? (
                    <Image
                      key={idx}
                      source={{ uri: med }}
                      style={{
                        width: width / 3 - 0.07 * width,
                        height: width / 3 - 0.06 * width,
                        margin: 0.01 * width,
                        borderWidth: 1,
                        borderColor: colors.primary,
                      }}
                    />
                  ) : null
                )}
              <View
                style={{
                  width: width / 3 - 0.07 * width,
                  height: width / 3 - 0.06 * width,
                  margin: 0.01 * width,
                  borderWidth: 1,
                  borderColor: colors.grey,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>{mediaLength} total </Text>
                {mediaLength != 1 ? <Text>images</Text> : <Text>image</Text>}
              </View>
              <TouchableOpacity
                style={{
                  width: width / 3 - 0.07 * width,
                  height: width / 3 - 0.06 * width,
                  margin: 0.01 * width,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => addPhoto()}
              >
                <Image
                  source={require("../config/Icons/add-image.png")}
                  style={{
                    width: "50%",
                    height: "50%",
                  }}
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export default ImageMode;
