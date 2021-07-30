import React, { useState, useEffect } from "react";
import { View, Image, Text, Platform } from "react-native";
import Button from "../components/Button";
import ItemCard from "../components/ItemCard";
import ItemScreen from "../components/ItemScreen";

import { fetch, getPropertiesInResourceTemplate } from "../../api/utils/Omeka";

function AllItemView({ navigation }) {
  const [items, setItems] = useState([]);

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
          res.map((item) => (
            <ItemCard
              title={item["o:title"]}
              id={item["o:resource_template"]["o:id"]}
              data={item}
              onPress = {() => navigation.navigate("Edit Item", {item: item["o:title"]})}
              baseAddress="158.101.99.206"
            />
          ))
        );
      })
      .catch((error) => console.log("error", error));
  });

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
      {items}
    </ItemScreen>
  );
}

export default AllItemView;
