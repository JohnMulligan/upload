import React, { useState, useEffect } from "react";
import { View, Image, Text, Platform, ScrollView } from "react-native";
import Button from "../components/Button";
import ItemCard from "../components/ItemCard";
import ItemScreen from "../components/ItemScreen";
import Header from "../components/Header";

import { fetchItemData, getThumbnail } from "../../api/utils/Omeka";
import { useFocusEffect } from "@react-navigation/native";

import { fetch, getPropertiesInResourceTemplate } from "../../api/utils/Omeka";
import * as SecureStore from "expo-secure-store";

function EditMode({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const filterMatches = (item) => {
    // console.log(item);
  };

  useFocusEffect(() => {
    if (loading) {
      // console.log('all')
      //server-side gets items 3 times despite having the client side log 2 times
      SecureStore.getItemAsync("host").then((host) => {
        SecureStore.getItemAsync("keys").then((keys) => {
          fetch(
            (baseAddress = host),
            (endpoint = "items"),
            (sortBy = "id"),
            (params = {
              key_identity: keys.split(",")[0],
              key_credential: keys.split(",")[1],
            })
          )
            .then((res) => {
              setItems(
                res.map((item, idx) => (
                  <ItemCard
                    key={idx}
                    title={item["o:title"]}
                    id={item["o:id"]}
                    data={item}
                    onPress={() =>
                      navigation.navigate("View Mode", {
                        screen: "Choose Upload Type",
                        params: { item: item["o:id"] },
                      })
                    }
                  />
                ))
              );
              setLoading(false);
            })
            .catch((error) => console.log("error", error));
        });
      });
    }
  });

  // useEffect(() => {
  //   if (search) {
  //     let filtered = items.filter(filterMatches);
  //     setItems(filtered);
  //   } else {
  //     setItems(items);
  //   }
  // }, [search]);

  return (
    <ItemScreen
      exit={() => navigation.goBack()}
      style={{
        flex: 1,
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ width: "100%" }}>
        <Header style={{ paddingLeft: 10 }} title="Upload to Existing" />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {loading ? <Text>Loading...</Text> : items}
      </ScrollView>
    </ItemScreen>
  );
}

export default EditMode;
