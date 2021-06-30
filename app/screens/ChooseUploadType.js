import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput
} from "react-native";

import Option from "../components/Option";
import Header from "../components/Header";
import ItemScreen from "../components/ItemScreen";
import Text from "../components/Text";
import Modal from "../components/Modal";
import ModalButton from "../components/ModalButton";
import NavigationButton from "../components/NavigationButton";

import colors from "../config/colors";

import AuthContext from "../../api/auth/context";
import ItemContext from "../../api/auth/itemContext";
import * as SecureStore from "expo-secure-store";

import {
  fetchOne,
  fetchResourceTemplates,
  fetchProperties,
  getPropertiesInResourceTemplate,
  getPropertyIds,
} from "../../api/utils/Omeka";

const { width, height } = Dimensions.get("window");

function ChooseUploadType({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const { item, setItem } = useContext(ItemContext);

  const [selected, setSelected] = useState([false, true, false, false]);
  const [singlePage, onChangeSinglePage] = useState(-1);

  const next = () => {
    if (selected[0]) {
      console.log('single page', singlePage)
      //need validation
      navigation.navigate("Upload Media", {type: 0, singlePage: singlePage});
    } else if (selected[1]) {
      navigation.navigate("Upload Media", {type: 1});
    } else if (selected[2]) {
      navigation.navigate("Upload Media", {type: 2});
    } else {
      navigation.navigate("Confirm");
    }
  };
  return (
    <ItemScreen
      style={{ flex: 1 }}
      exit={() => navigation.navigate("Quick Start")}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Header title="Upload Media" />
        <Text style={{ paddingBottom: 10, paddingRight: 25 }}>{item[0]}</Text>
      </View>
      <View style={styles.body}>
        <Text style={{ fontSize: 24 }} weight="bold">
          Choose Upload Type
        </Text>
        <Option
          onPress={() => setSelected([true, false, false, false])}
          selected={selected[0]}
          text="I'm only uploading one file"
        />
        {selected[0] && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}
          >
            <Text weight = "light" style = {{fontSize: 14, paddingLeft: 10}}>Set page number (optional)</Text>
            <TextInput
              autocorrect={false}
              onChangeText = {onChangeSinglePage} 
              style={{
                borderRadius: 7.5,
                borderWidth: 2,
                padding: 5,
                height: 30,
                width: 50,
                paddingHorizontal: 10,
                borderColor: colors.primary,
                fontFamily: "Barlow_400Regular",
              }}
            />
          </View>
        )}
        <View style={styles.divider} />
        <Option
          onPress={() => setSelected([false, true, false, false])}
          selected={selected[1]}
          text="Auto-increment pages (starting with #1)"
        />
        <Option
          onPress={() => setSelected([false, false, true, false])}
          selected={selected[2]}
          text="Assign page numbers as you go"
        />
        <View style={styles.divider} />

        <Option
          onPress={() => setSelected([false, false, false, true])}
          selected={selected[3]}
          text="I don't want to upload any media"
        />
      </View>
      {/* {modal && (
        <>
          <Modal title="New item successfully created!">
            <View style={styles.children}>
              <ModalButton
                onPress={() => uploadMedia()}
                line={2}
                title="UPLOAD MEDIA"
              />
              <ModalButton
                onPress={() => navigation.navigate("Quick Start")}
                color={colors.light}
                line={2}
                title="EXIT"
              />
            </View>
          </Modal>
          <View style={styles.shadow} />
        </>
      )} */}
      <NavigationButton
        style={styles.back}
        // onPress={() => back()}
        label="Back"
        direction="left"
      />
      <NavigationButton
        style={styles.next}
        onPress={() => next()}
        label="Done"
        direction="right"
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
    padding: 20,
  },
  children: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  divider: {
    height: 2,
    backgroundColor: colors.primary,
    width: "100%",
    marginVertl: 20,
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

export default ChooseUploadType;
