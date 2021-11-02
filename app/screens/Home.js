import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Image,
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Button from "../components/Button";
import Card from "../components/Card";
import Text from "../components/Text";
import ItemScreen from "../components/ItemScreen";
import colors from "../config/colors";

import AuthContext from "../../api/auth/context";
import * as SecureStore from "expo-secure-store";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

function Home({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, setUser } = useContext(AuthContext);
  const [host, setHost] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync("host").then((host) => {
      setHost(host);
      // console.log("host", host);
      setLoading(false);
    });
  });

  function logOut() {
    SecureStore.deleteItemAsync("keys")
      .then(setUser(null))
      .catch((error) => console.log("error", error));
  }

  return (
    <ItemScreen style={{ flex: 1, alignItems: "center" }}>
      {loading ? (
        <View>
          <Text>Loading...</Text>
        </View>
      ) : (
        <View>
          <View style={styles.body}>
            <Text
              weight="bold"
              style={{
                fontSize: 18,
                textAlign: "center",
                color: colors.primary,
                marginTop: 10,
              }}
            >
              currently logged into {host}
            </Text>
            <View>
              <Image
                source={require("../config/Icons/scbird.png")}
                style={{
                  resizeMode: "contain",
                  position: "relative",
                  right: 25,
                  height: 75,
                }}
              />
              <Card
                style={[styles.shadow, {
                  width: 0.85 * width,
                  maxHeight: 0.3 * height,
                }]}
                onPress={() =>
                  navigation.navigate("Create Item", {
                    screen: "Create New Item",
                  })
                }
                title="Create a new item"
              >
                <Text style={{ fontSize: 14, color: colors.grey }}>
                  Choose from the list of resource templates to create a new
                  item and upload image attachments
                </Text>
              </Card>
              <Card
                style={[styles.shadow, {
                  width: 0.85 * width,
                  maxHeight: 0.3 * height,
                }]}
                title="View, modify, or duplicate items"
                onPress={() => navigation.navigate("View All Items")}
              >
                <Text style={{ fontSize: 14, color: colors.grey }}>
                  All currently uploaded items and media in the Omeka S
                  database. Find an item and upload additional media to it.
                </Text>
              </Card>
            </View>
          </View>
          <View
            style={[styles.footer, { height: 0.4 * height - insets.top - 30 }]}
          >
            <Button
              onPress={() => logOut()}
              title="Logout"
              style={[styles.shadow, { width: 0.5 * width }]}
            />
            <Text
              weight="italic"
              style={{ marginTop: 10, color: colors.primary, fontSize: 18 }}
            >
              Special Collections
            </Text>
          </View>
        </View>
      )}
    </ItemScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    height: 0.6 * height,
    justifyContent: "space-between",
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  footer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default Home;
