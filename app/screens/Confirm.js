import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Card from "../components/Card";
import Header from "../components/Header";
import ItemScreen from "../components/ItemScreen";
import TextInput from "../components/TextInput";
import Text from "../components/Text";
import Icon from "../components/Icon";
import Modal from "../components/Modal";
import ModalButton from "../components/ModalButton";
import NavigationButton from "../components/NavigationButton";
import Button from "../components/Button";

import colors from "../config/colors";

import { fetchResourceTemplates } from "../../api/utils/Omeka";
import * as axios from "axios";
import AuthContext from "../../api/auth/context";
import ItemContext from "../../api/auth/itemContext";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

function Confirm({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const { item, setItem } = useContext(ItemContext);

  return (
    <ItemScreen style={{ flex: 1 }} exit={() => navigation.navigate("Home")}>
      <Header title="Review Changes" />
      <View style={styles.body}>
        <Text weight="medium" style={{ fontSize: 18 }}>
          Item Metadata
        </Text>
        <Text>{item}</Text>
        <Button onPress={() => navigation.navigate("Home")} title="FINISH" />
      </View>
      <NavigationButton
        onPress={() => navigation.goBack()}
        label="Back"
        direction="left"
        style={styles.back}
      />
    </ItemScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.blue,
    height: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
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
    backgroundColor: colors.gray,
  },
  next: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  back: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
});
export default Confirm;
