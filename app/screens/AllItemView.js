import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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

  useEffect(() => {
    console.log("effect");
    SecureStore.getItemAsync("host").then((host) => {
      SecureStore.getItemAsync("keys").then((keys) => {
        fetch(
          (baseAddress = host),
          (endpoint = "items"),
          (loadpage = page),
          (itemSetId = -1),
          (params = {
            key_identity: keys.split(",")[0],
            key_credential: keys.split(",")[1],
          }),
          (start = 1),
          sortBy = "o:modified",
          sortOrder = "desc"
        )
          .then((res) => {
            setTitles(res.map((item, idx) => item));
            setItems(
              res.map((item, idx) => (
                <ItemCard
                  key={idx}
                  keys={keys}
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
  }, [page]);

  const loadPage = (inc) => {
    if(page+inc != 0) setPage(page + inc);
  };

  useFocusEffect(() => {
    if (loading) {
      // console.log('all')
      //server-side gets items 3 times despite having the client side log 2 times
      SecureStore.getItemAsync("host").then((host) => {
        setHost(host);
        SecureStore.getItemAsync("keys").then((keys) => {
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
            .catch((error) => console.log("focus error", error));
        });
      });
    }
  });

  const search = () => {
    if (keyword != "") {
      SecureStore.getItemAsync("host").then((host) => {
        SecureStore.getItemAsync("keys").then((keys) => {
          fetchItemsFilter(
            host,
            "items",
            keys,
            keyword,
          )
            .then((res) => {
              console.log("res", res);
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
    }
  };

  const reset = () => {
    setKeyWord("");
    setFilteredSearches(null);
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
          marginBottom: 10,
        }}
      >
        <TextInput
          value={keyword}
          onChangeText={(newval) => setKeyWord(newval)}
          style={{ width: "87%" }}
          onSubmitEditing={() => search()}
        />
        <TouchableOpacity onPress={() => reset()}>
          <Image
            source={require("../config/Icons/close.png")}
            style={{ width: 15, height: 15, right: 30, bottom: 2 }}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{ right: 5 }} onPress={() => search()}>
          <Image
            source={require("../config/Icons/search.png")}
            style={{ width: 25, height: 25 }}
          />
        </TouchableOpacity>
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
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <NavigationButton direction={"left"} onPress={() => loadPage(-1)} />
        <NavigationButton onPress={() => loadPage(1)} />
      </View>
    </ItemScreen>
  );
}

export default AllItemView;
