import React, { useState, useEffect } from "react";
import { View, Image, Text, Platform, ScrollView } from "react-native";
import Button from "../components/Button";
import NavigationButton from "../components/NavigationButton";

import ItemCard from "../components/ItemCard";
import ItemScreen from "../components/ItemScreen";
import Header from "../components/Header";
import IconButton from "../components/IconButton";

import TextInput from "../components/TextInput";

import { fetchItemData, getThumbnail } from "../../api/utils/Omeka";
import { useFocusEffect } from "@react-navigation/native";

import {
  fetch,
  getPropertiesInResourceTemplate,
  fetchItemsFilter,
} from "../../api/utils/Omeka";
import * as SecureStore from "expo-secure-store";

function AllItemView({ navigation }) {
  const [items, setItems] = useState([]);
  const [host, setHost] = useState("");
  const [keys, setKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyWord] = useState("");
  const [filteredSearches, setFilteredSearches] = useState(null);
  const [page, setPage] = useState(1);
  const [titles, setTitles] = useState([]);

  const filterMatches = (item) => {
    // console.log(item);
  };

  const loadPage = (inc) => {
    setPage(page + inc);
    fetch(
      (baseAddress = host),
      (endpoint = "items"),
      (loadpage = page),
      (itemSetId = -1),
      (params = keys),
      (start = 1)
    )
      .then((res) => {
        // console.log(res);
        setTitles(res.map((item, idx) => item));
        setItems(
          res.map((item, idx) => (
            <ItemCard
              key={idx}
              title={item["o:title"]}
              id={item["o:id"]}
              data={item}
              onPress={() =>
                navigation.navigate("Item View", {
                  item: item,
                })
              }
            />
          ))
        );
      })
      .catch((error) => console.log("error", error));
  };

  useFocusEffect(() => {
    if (loading) {
      // console.log('all')
      //server-side gets items 3 times despite having the client side log 2 times
      SecureStore.getItemAsync("host").then((host) => {
        setHost(host);
        SecureStore.getItemAsync("keys").then((keys) => {
          setKeys({
            key_identity: keys.split(",")[0],
            key_credential: keys.split(",")[1],
          });
          fetch(
            (baseAddress = host),
            (endpoint = "items"),
            (loadpage = page),
            (itemSetId = -1),
            (params = {
              key_identity: keys.split(",")[0],
              key_credential: keys.split(",")[1],
            }),
            (start = 1)
          )
            .then((res) => {
              // console.log(res);
              setLoading(false);
              setTitles(res.map((item, idx) => item));
              setItems(
                res.map((item, idx) => (
                  <ItemCard
                    key={idx}
                    title={item["o:title"]}
                    id={item["o:id"]}
                    data={item}
                    onPress={() =>
                      navigation.navigate("Item View", {
                        item: item,
                      })
                    }
                  />
                ))
              );
            })
            .catch((error) => console.log("error", error));
        });
      });
    }
  });

  const search = () => {
    SecureStore.getItemAsync("host").then((host) => {
      SecureStore.getItemAsync("keys").then((keys) => {
        fetchItemsFilter(
          host,
          "items",
          keyword,
          (params = {
            key_identity: keys.split(",")[0],
            key_credential: keys.split(",")[1],
          })
        )
          .then((res) => {
            setFilteredSearches(
              res.map((item, idx) => (
                <ItemCard
                  key={idx}
                  title={item["o:title"]}
                  id={item["o:id"]}
                  data={item}
                  onPress={() =>
                    navigation.navigate("Item View", {
                      item: item,
                    })
                  }
                />
              ))
            );
          })
          .catch((error) => console.log("error", error));
      });
    });
  };

  return (
    <ItemScreen
      exit={() => navigation.goBack()}
      style={{
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ width: "100%" }}>
        <Header style={{ paddingLeft: 10 }} title="View + Edit Items" />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          onChangeText={(newval) => setKeyWord(newval)}
          style={{ width: "75%" }}
        />
        <Button
          style={{ width: "25%", height: 40, padding: 0, marginBottom: 20 }}
          title="search"
          onPress={() => search()}
        />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {loading ? (
          <Text>Loading...</Text>
        ) : filteredSearches ? (
          filteredSearches
        ) : (
          items
        )}
      </ScrollView>
      <View style={{ flexDirection: "row", width: '100%', justifyContent: "space-between" }}>
        <NavigationButton direction={"left"} onPress={() => loadPage(-1)} />
        <NavigationButton onPress={() => loadPage(1)} />
      </View>
    </ItemScreen>
  );
}

export default AllItemView;
