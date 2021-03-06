import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  Platform,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import ItemScreen from "../components/ItemScreen";
import Text from "../components/Text";
import Modal from "../components/Modal";
import ModalButton from "../components/ModalButton";
import NavigationButton from "../components/NavigationButton";
import Button from "../components/Button";
import Camera from "../components/Camera";
import colors from "../config/colors";

import ItemContext from "../../api/auth/itemContext";
import AuthContext from "../../api/auth/context";
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get("window");

function UploadMedia({ navigation, route }) {
  const [cameraOn, setCameraOn] = useState(true);
  const [nextModal, setNextModal] = useState(false);

  const { item, setItem } = useContext(ItemContext);
  const { user, setUser } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(
    parseInt(route.params.page ? route.params.page : 1)
  );

  const skip = () => {
    setNextModal(true);
  };

  return (
    <>
      <View style={styles.header}>
        <Header title="Camera" />
        <TouchableOpacity
          onPress={() => navigation.navigate("View All Items")}
          style={styles.back}
        >
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../config/Icons/close.png")}
          />
        </TouchableOpacity>
      </View>
      <Camera
        navigation={navigation}
        params={route.params}
        page={currentPage}
        setPage={setCurrentPage}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    width: "100%",
    paddingTop: StatusBar.currentHeight + 40,
    position: "absolute",
    zIndex: 10,
  },
  image: {
    height: 0.5 * height,
    justifyContent: "center",
    alignItems: "center",
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
    zIndex: 5,
  },
  navigation: {
    position: "absolute",
    bottom: 30,
    justifyContent: "flex-end",
    alignItems: "center",
    width: width,
    height: 0.2 * height,
  },
  back: {
    marginTop: 30,
    width: 25,
    height: 25,
    position: "absolute",
    zIndex: 5,
    right: 20,
    top: 20,
  },
  next: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
export default UploadMedia;
