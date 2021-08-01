import React, { useState, useEffect } from "react";
import { View, Image, Text, Platform, ScrollView } from "react-native";
import Button from "../components/Button";
import ItemCard from "../components/ItemCard";
import ItemScreen from "../components/ItemScreen";
import Header from "../components/Header";

import { fetchItemData } from "../../api/utils/Omeka";

import { fetch, getPropertiesInResourceTemplate } from "../../api/utils/Omeka";

function AllItemView({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const filterMatches = item => {
    console.log(item)
  }

  useEffect(() => {
    fetch(
      (baseAddress = "158.101.99.206"),
      (endpoint = "items"),
      (sortBy = "id"),
      (params = {
        key_identity: "OICzKK7enYzPejBUNe4n3OJXclbkdxl7",
        key_credential: "JVulf5Tg6kjM4ozB9LQ61aOVeQ9hjtPf",
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
                navigation.navigate("Edit Item", { item: item })
              }
              baseAddress="158.101.99.206"
            />
          ))
        );
      })
      .catch((error) => console.log("error", error));
  });

  useEffect(() => {
    if (search) {
      let filtered = items.filter(filterMatches);
      setItems(filtered);
    } else {
      setItems(items);
    }
  }, [search])


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
      <View style = {{width: '100%'}}>
        <Header style = {{paddingLeft: 10}} title="Find and Edit" />
      </View>
      <ScrollView style={{ flex: 1 }}>{items}</ScrollView>
    </ItemScreen>
  );
}

export default AllItemView;
