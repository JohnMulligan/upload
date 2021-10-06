import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import * as axios from "axios";
import { Formik, useFormikContext } from "formik";
import { useFocusEffect } from "@react-navigation/native";

import IconButton from "../components/IconButton";
import Button from "../components/Button";
import Card from "../components/Card";
import Header from "../components/Header";
import ItemScreen from "../components/ItemScreen";
import TextInput from "../components/TextInput";
import Text from "../components/Text";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import ModalButton from "../components/ModalButton";
import NavigationButton from "../components/NavigationButton";
import ErrorMessage from "../components/ErrorMessage";

import colors from "../config/colors";

import AuthContext from "../../api/auth/context";
import ItemContext from "../../api/auth/itemContext";
import * as SecureStore from "expo-secure-store";

import ViewMode from "./ViewMode";
import EditMode from "./EditMode";
import CopyMode from "./CopyMode";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  fetchOne,
  fetchResourceTemplates,
  fetchProperties,
  getPropertiesInResourceTemplate,
  getPropertyIds,
  patchItem,
} from "../../api/utils/Omeka";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

function ItemView({ navigation, route }) {
  const { user, setUser } = useContext(AuthContext);
  const [host, setHost] = useState("");
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState("view");

  // useEffect(() => {
  //   console.log('item', route.params.item);
  // });

  const switchMode = (mode) => {
    setMode(mode);
  };

  return (
    <ItemScreen style = {{backgroundColor: mode == "edit" ? colors.blue : colors.light}} exit={() => navigation.goBack()}>
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
        <Text weight="bold">mode > {mode}ing</Text>
      </View>
      {mode == "view" ? (
        <ViewMode
          switchMode={(mode) => switchMode(mode)}
          item={route.params.item}
        />
      ) : mode == "edit" ? (
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
          path="../config/Icons/label.png"
          selected={mode == "view"}
          label="view"
          onPress={() => switchMode("view")}
        />
        <IconButton
          path="../config/Icons/label.png"
          label="edit"
          selected={mode == "edit"}
          onPress={() => switchMode("edit")}
        />
        <IconButton
          path="../config/Icons/label.png"
          selected={mode == "copy"}
          label="copy"
          onPress={() => switchMode("copy")}
        />
      </View>
    </ItemScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.blue,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    flex: 1,
  },
  icon: {
    position: "absolute",
    zIndex: 5,
  },
  picker: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 5,
    height: 40,
    paddingHorizontal: 10,
    borderColor: colors.primary,
    justifyContent: "center",
    marginBottom: 5,
  },
  children: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  shadow: {
    position: "absolute",
    top: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: width,
    height: height,
    backgroundColor: colors.shadow,
    zIndex: 9,
    justifyContent: "center",
    alignItems: "center",
    padding: "15%",
  },
  next: {
    position: "absolute",
  },
});
export default ItemView;
