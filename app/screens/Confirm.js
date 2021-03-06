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

import { fetchItemData } from "../../api/utils/Omeka";
import * as axios from "axios";
import AuthContext from "../../api/auth/context";
import ItemContext from "../../api/auth/itemContext";
import * as SecureStore from "expo-secure-store";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

function Confirm({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const { item, setItem } = useContext(ItemContext);
  const [itemData, setItemData] = useState({});
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    SecureStore.getItemAsync("host").then((host) => {
      SecureStore.getItemAsync("keys").then((keys) => {
        fetchItemData(host, "items", item[0], {
          key_identity: keys.split(",")[0],
          key_credential: keys.split(",")[1],
        })
          .then((res) => {
            if (loading == true) {
              setItemData(res);
              setLoading(false);
            }
          })
          .catch((error) => console.log("error", error));
      });
    });
  });

  return (
    <ItemScreen style={{ flex: 1 }} exit={() => navigation.navigate("Home")}>
      <Header title="Review Changes" />

      <View style={styles.body}>
        {!loading && (
          <>
            <View style={{ width: "100%", flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
              <Text weight="medium" style={{ fontSize: 24 }}>
                {itemData[0][1]}
              </Text>
              <Button
                onPress={() =>
                  navigation.navigate("Create New Item", { mode: "edit" })
                }
                style={{ width: "20%", height: 34, padding: 5}}
                title="Edit"

              />
            </View>
            <View>
              {itemData.map(
                (prop, idx) =>
                  idx > 1 && (
                    <View key = {idx}>
                      <View style={styles.prop}>
                        <View style={{ maxWidth: "40%" }}>
                          <Text style={{ fontSize: 18 }} weight="medium">
                            {prop[0]}
                          </Text>
                        </View>
                        <View style={{ maxWidth: "60%" }}>
                          <Text>{prop[1]}</Text>
                        </View>
                      </View>
                      <View
                        style={{
                          height: 1,
                          backgroundColor: colors.grey,
                          width: "100%",
                        }}
                      />
                    </View>
                  )
              )}
            </View>

            {/* <View>
              <Text style={{ fontSize: 24, marginTop: 20 }} weight={"medium"}>
                Media
              </Text>
            </View> */}
          </>
        )}
      </View>
      <Button
        style={[styles.done, { bottom: insets.bottom }]}
        onPress={() => navigation.navigate("Home")}
        title="DONE"
      />

      <NavigationButton
        onPress={() => navigation.goBack()}
        label="Back"
        direction="left"
        style={[styles.back, { bottom: insets.bottom }]}
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
  prop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  back: {
    position: "absolute",
    left: 30,
  },
  done: {
    position: "absolute",
    width: width / 2 - 30,
    left: width / 4 + 15,
  },
});
export default Confirm;
