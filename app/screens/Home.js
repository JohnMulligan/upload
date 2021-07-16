import React, { useState, useContext } from "react";
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Card from "../components/Card";
import Text from "../components/Text";
import Screen from "../components/Screen";
import Header from "../components/Header";
import colors from "../config/colors";

import AuthContext from "../../api/auth/context";
import { logOut } from "../../api/auth/authStorage";

const { width, height } = Dimensions.get("window");

function Home({ navigation }) {
  const { user, setUser } = useContext(AuthContext);

  function loadCamera() {
    navigation.navigate("Create Item", {
      screen: "Upload Media",
      params: { type: 1, testItem: 337 },
    });
  }

  return (
    <Screen>
        <Card activeOpacity={1} title="Create New Item">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Create Item", { screen: "Create New Item" })
            }
            style={[{ marginRight: "5%" }, styles.newitem]}
          >
            <Text style={styles.mediumtext} weight="medium">
              Start from a Blank Template
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.newitem}>
            <Text style={styles.mediumtext} weight="medium">
              Copy Contents from an Existing Item
            </Text>
          </TouchableOpacity>
        </Card>
        <Card
          title="Find Item"
          onPress={() => navigation.navigate("Find and Edit")}
        ></Card>
        <Card
          title="Recently Added"
          onPress={() => navigation.navigate("View All Items")}
        >
          <TouchableOpacity onPress={() => loadCamera()}>
            <Text>Load Camera</Text>
          </TouchableOpacity>
        </Card>
        <TouchableOpacity onPress={() => logOut(setUser(null))}>
          <Text>Log out</Text>
        </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 0.8 * width,
    backgroundColor: colors.light,
    //height: .3*height,
  },
  newitem: {
    borderWidth: 2,
    width: "47.5%",
    height: "100%",
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
  mediumtext: {
    fontSize: 18,
    textAlign: "center",
    color: colors.primary,
  },
});

export default Home;
