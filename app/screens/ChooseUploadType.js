import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
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
  const [assignPage, onChangeAssignPage] = useState(1);

  const next = () => {
    if (selected[0]) {
      console.log("single page", singlePage);
      //need validation
      navigation.navigate("Upload Media", { type: 0, page: singlePage });
    } else if (selected[1]) {
      navigation.navigate("Upload Media", { type: 1, page: 1 });
    } else if (selected[2]) {
      navigation.navigate("Upload Media", {
        type: 2,
        page: assignPage,
      });
    } else {
      navigation.navigate("Confirm");
    }
  };

  const back = () => {
    navigation.navigate("Create New Item");
  };
  return (
    <ItemScreen
      style={{ flex: 1 }}
      exit={() => navigation.navigate("Home")}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Header title="Choose Upload Type" />
      </View>
      <View style={styles.body}>
        <Option
          onPress={() => setSelected([true, false, false, false])}
          selected={selected[0]}
          text="I'm only uploading one file"
          description="For quick, single image uploads. Take a picture or select from camera roll and upload directly to Omeka."
        >
          {selected[0] && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                weight="medium"
                style={{ color: colors.grey, fontSize: 14 }}
              >
                Set page number (optional)
              </Text>
              <TextInput
                autocorrect={false}
                onChangeText={onChangeSinglePage}
                style={{
                  borderRadius: 7.5,
                  borderWidth: 1,
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
        </Option>

        <View style={styles.divider} />
        <Option
          onPress={() => setSelected([false, true, false, false])}
          selected={selected[1]}
          text="Auto-increment page uploads"
          description="Counts the number of pages for you, starting at no. 1. Can’t edit page number while uploading."
        />
        <Option
          onPress={() => setSelected([false, false, true, false])}
          selected={selected[2]}
          text="Assign page numbers as you go"
          description="Give each image an assigned page number. Automatically starts at 1 and defaults to the next number"
        >
          {selected[2] && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View style={{ width: "80%" }}>
                <Text
                  weight="medium"
                  style={{ color: colors.grey, fontSize: 14, flexWrap: 'wrap' }}
                >
                  Set starting page number (optional)
                </Text>
              </View>
              <TextInput
                autocorrect={false}
                onChangeText={onChangeAssignPage}
                style={{
                  borderRadius: 7.5,
                  borderWidth: 1,
                  padding: 5,
                  height: 30,
                  width: '20%',
                  paddingHorizontal: 10,
                  borderColor: colors.primary,
                  fontFamily: "Barlow_400Regular",
                }}
              />
            </View>
          )}
        </Option>
        <View style={styles.divider} />

        <Option
          onPress={() => setSelected([false, false, false, true])}
          selected={selected[3]}
          text="I don't want to upload any media"
          description="Finish item now. You can go back and upload more media later."
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
        onPress={() => back()}
        label="Back"
        direction="left"
      />
      <View style={styles.info}>
        <Text
          style={{ textAlign: "center", paddingBottom: 10, paddingRight: 25 }}
        >
          This will upload images under the item {item[0]}
        </Text>
      </View>
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
    marginVertical: 5,
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
  info: {
    position: "absolute",
    bottom: 30,
    width: width / 2,
    minHeight: 50,
    left: width / 4,
  },
  back: {
    position: "absolute",
    bottom: 30,
    left: 30,
  },
});

export default ChooseUploadType;
