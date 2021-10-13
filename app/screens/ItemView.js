import React, { useState, useEffect, useContext } from "react";
import { View, ScrollView, Dimensions } from "react-native";
import IconButton from "../components/IconButton";
import Button from "../components/Button";
import ItemScreen from "../components/ItemScreen";
import Text from "../components/Text";

import colors from "../config/colors";

import * as SecureStore from "expo-secure-store";

import ViewMode from "./ViewMode";
import EditMode from "./EditMode";
import CopyMode from "./CopyMode";
import ImageMode from "./ImageMode";

import {
  fetchOne,
  fetchResourceTemplates,
  fetchProperties,
  getPropertiesInResourceTemplate,
  getPropertyIds,
  patchItem,
} from "../../api/utils/Omeka";

const { width, height } = Dimensions.get("window");

function ItemView({ navigation, route }) {
  const [mode, setMode] = useState("view");

  const switchMode = (mode) => {
    if (mode == "image")
      navigation.navigate("Create Item", {
        screen: "Choose Upload Type",
        params: { item: route.params.item["o:id"] },
      });
    setMode(mode);
  };

  return (
    <ItemScreen
      style={{ backgroundColor: mode == "edit" ? colors.blue : colors.light }}
      exit={() => navigation.goBack()}
    >
      <View
        style={{
          backgroundColor: colors.primary,
          height: 30,
          justifyContent: "center",
          paddingVertical: 5,
          paddingHorizontal: 10,
          marginHorizontal: 20,
          marginTop: 50,
          zIndex: 10,
          borderRadius: 20,
          left: 0,
          position: "absolute",
        }}
      >
        <Text weight="bold">mode > {mode}</Text>
      </View>
      {mode == "view" ? (
        <ViewMode
          switchMode={(mode) => switchMode(mode)}
          item={route.params.item}
        />
      ) : 
      mode == "image" ? ( 
        <ImageMode navigation = {navigation} item={route.params.item} />
      ) : 
      mode == "edit" ? (
        <EditMode item={route.params.item} />
      ) : (
        <CopyMode item={route.params.item} />
      )}
      <View
        style={{
          marginHorizontal: "30%",
          position: "relative",
          bottom: 30,
          flexDirection: "row",
          width: "40%",
          justifyContent: "space-between",
        }}
      >
        <IconButton
          selected={mode == "view" || mode == "edit"}
          label="view"
          onPress={() => switchMode("view")}
        />
        <IconButton
          label="image"
          selected={mode == "image"}
          onPress={() => switchMode("image")}
        />
        <IconButton
          selected={mode == "copy"}
          label="copy"
          onPress={() => switchMode("copy")}
        />
      </View>
    </ItemScreen>
  );
}

export default ItemView;
