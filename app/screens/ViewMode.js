import React, { useState, useEffect } from "react";
import { View, Image, Platform, ScrollView } from "react-native";
import Button from "../components/Button";
import ItemCard from "../components/ItemCard";
import ItemScreen from "../components/ItemScreen";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import Text from "../components/Text";
import { fetchItemData, getThumbnail } from "../../api/utils/Omeka";
import axios from "axios";

import * as SecureStore from "expo-secure-store";

import colors from "../config/colors";

function ViewMode({ navigation, item, switchMode }) {
  const [properties, setProperties] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);

  const [host, setHost] = useState();
  const [keys, setKeys] = useState();

  useEffect(() => {
    // console.log(route.params.item);
    SecureStore.getItemAsync("host").then((host) => {
      setHost(host);
      SecureStore.getItemAsync("keys").then((keys) => {
        setKeys(keys);
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

  // const deleteItem = () => {
  //   console.log(`http://${host}/api/items/${item["o:id"]}?key_identity=${
  //         keys.split(",")[0]
  //       }&key_credential=${keys.split(",")[1]}`)
  //   axios
  //     .delete(
  //       `http://${host}/api/items/${item["o:id"]}?key_identity=${
  //         keys.split(",")[0]
  //       }&key_credential=${keys.split(",")[1]}`
  //     )
  //     .then((res) => console.log("res", res))
  //     .catch(err => console.log(err))
  // };

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
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <View>
            <View style = {{flexDirection: 'row', height: 30, justifyContent: 'center'}}>
              <Text weight="italic" style={{ textAlign: "center" }}>
                Viewing
              </Text>

              <IconButton
                label="edit"
                onPress={() => switchMode("edit")}
                borderColor={colors.light}
                style={{bottom: 30}}
              />
            </View>
            <Text
              weight="bold"
              style={{ textAlign: "center", fontSize: 28, marginBottom: 15 }}
            >
              {item["o:title"]}
            </Text>
          </View>
        </View>
        <ScrollView style={{ height: "75%" }}>
          {loading ? (
            <Text>Loading fields...</Text>
          ) : (
            <>
              {properties.map(
                (prop, idx) =>
                  idx > 1 &&
                  prop[0] != "Title" && (
                    <View
                      key = {idx + 2}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ marginVertical: 7.5 }} key={idx}>
                        <Text
                          style={{ fontSize: 18, marginBottom: 2 }}
                          weight="bold"
                        >
                          {prop[0]}
                        </Text>
                        <Text style={{ fontSize: 20 }}>{prop[1]}</Text>
                      </View>
                    </View>
                  )
              )}
              {/* <Button title="DELETE" onPress={() => deleteItem()} /> */}
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

export default ViewMode;
