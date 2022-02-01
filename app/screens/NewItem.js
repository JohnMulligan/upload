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

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  fetchOne,
  fetchResourceTemplates,
  fetchProperties,
  getPropertiesInResourceTemplate,
  getPropertyIds,
  patchItem,
} from "../../api/utils/Omeka";

const { width, height } = Dimensions.get("window");

function NewItem({ navigation, route }) {
  const { user, setUser } = useContext(AuthContext);
  const { item, setItem } = useContext(ItemContext);
  const [host, setHost] = useState("");

  const [resourceTemplates, setResourceTemplates] = useState([]);
  const [templateId, setTemplateId] = useState(0);
  const [templateSelected, setTemplateSelected] = useState(""); //
  const [modal, setModal] = useState(false);
  const [IDs, setIDs] = useState([]);
  const [types, setTypes] = useState({});
  const [values, setValues] = useState({});
  const [error, setError] = useState(false);
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  //make authentication pathway here for keys
  useFocusEffect(() => {
    if (loading) {
      // console.log(".");
      if (route.params && route.params.item) {
        setItem(route.params.item["o:id"]);
      }

      SecureStore.getItemAsync("host").then((host) => {
        setHost(host);
        fetchResourceTemplates(host)
          .then((response) => {
            setResourceTemplates(response);
          })
          .catch((error) => console.log(error));
        setLoading(false);
      });
    }
  });

  const loadFields = async (value, idx) => {
    setError(false);
    setValues({});
    setTemplateSelected(value);
    const itemSelected = getItems().filter((item) => item.label == value);
    if (itemSelected.length > 0) setTemplateId(itemSelected[0].id);
    //voids "Select an item"
    if (idx != 0) {
      setTypes(
        await getPropertiesInResourceTemplate(host, itemSelected[0].id).then(
          (res) => res.map((prop) => prop.data)
        )
      );
      setIDs(await getPropertyIds(host, itemSelected[0].id).then((res) => res));
    }
  };

  const next = () => {
    navigation.navigate("Create Item", { screen: "Choose Upload Type" });
  };

  const uploadMedia = () => {
    setModal(false);
    navigation.navigate("Create Item", { screen: "Choose Upload Type" });
  };

  const getItems = () => {
    let templates = [];
    resourceTemplates.map((item) =>
      templates.push({
        label: item["o:label"],
        value: item["o:label"],
        class: item["o:resource_class"]["o:id"],
        id: item["o:id"],
      })
    );
    return templates;
  };

  const createItem = () => {
    let payload = {};
    let title = values[types[0]["o:label"]];

    let v = IDs.map((id, idx) => [
      {
        type: "literal",
        property_id: id,
        property_label: types[idx]["o:label"],
        "@value": values[types[idx]["o:label"]],
        is_public: false,
      },
    ]);

    IDs.map((id, idx) => (payload[types[idx]["o:term"]] = v[idx]));
    payload["o:resource_template"] = {
      "@id": `http://${host}/api/resource_templates/${templateId}`,
      "o:id": templateId,
    };
    let templates = getItems()[0];
    payload["o:resource_class"] = {
      "o:id": templates.class,
    };
    payload["o:is_public"] = false;
    console.log('payload', payload);
    if (!title) {
      setError(true);
    } else {
      setError(false);
      SecureStore.getItemAsync("keys")
        .then((keys) => {
          {
            route.params && route.params.mode && route.params.mode == "edit"
              ? axios
                  .patch(
                    `http://${host}/api/items/${item[0]}?key_identity=${
                      keys.split(",")[0]
                    }&key_credential=${keys.split(",")[1]}`,
                    payload
                  )
                  .then((res) => navigation.navigate("Confirm"))
                  .catch((error) => console.log(error))
              : axios
                  .post(`http://${host}/api/items`, payload, {
                    params: {
                      key_identity: keys.split(",")[0],
                      key_credential: keys.split(",")[1],
                    },
                  })
                  .then((response) => {
                    console.log(response.data);
                    setItem([response.data["o:id"], user]);
                    setModal(true);
                  })
                  .catch((error) => {
                    console.log("error");
                  });
          }
        })
        .catch((error) => console.log("credentials failed", error));
    }
  };

  const handleChangeText = (title, value, id) => {
    setError(false);
    values[title + ""] = value;
    setValues({ ...values });
  };

  return (
    <ItemScreen style={{ flex: 1 }} exit={() => navigation.goBack()}>
      <Header
        title={
          route.params && route.params.mode && route.params.mode == "edit"
            ? "Edit Item"
            : "Create New Item"
        }
      />
      <View style={styles.body}>
        <Formik
          initialValues={types}
          onSubmit={(values) => {
            createItem(values);
          }}
        >
          {({ handleSubmit }) => (
            <>
              <KeyboardAwareScrollView
                style={{ flex: 1, height: height - 130 }}
              >
                <View>
                  <Text style={{ paddingBottom: 2, paddingLeft: 2 }}>
                    Resource Templates
                  </Text>
                  <View style={styles.picker}>
                    <RNPickerSelect
                      items={getItems()}
                      onValueChange={(value, idx) => {
                        loadFields(value, idx);
                      }}
                    />
                  </View>
                  {templateSelected ? (
                    <>
                      {Object.keys(types).map((data, idx) => (
                        <TextInput
                          onChangeText={(value) =>
                            handleChangeText(types[data]["o:label"], value, IDs[idx])
                          }
                          multiline={false}
                          name={types[data]["o:label"]}
                          id={IDs[idx]}
                          key={idx}
                          value={values[types[data]["o:label"] + ""]}
                        />
                      ))}
                      <ErrorMessage error="Title required" visible={error} />
                      <View
                        style={{
                          alignItems: "center",
                          marginTop: 10,
                          marginBottom: 50,
                        }}
                      >
                        <Button
                          onPress={handleSubmit}
                          title={
                            route.params &&
                            route.params.mode &&
                            route.params.mode == "edit"
                              ? "EDIT"
                              : "CREATE"
                          }
                        />
                      </View>
                    </>
                  ) : (
                    <View>
                      <Text>
                        Please select a Resource Template to get started.
                      </Text>
                    </View>
                  )}
                </View>
              </KeyboardAwareScrollView>
            </>
          )}
        </Formik>
      </View>
      {modal && (
        <>
          <Modal title="New item successfully created!">
            <View style={styles.children}>
              <ModalButton
                onPress={() => uploadMedia()}
                line={2}
                title="UPLOAD MEDIA"
              />
              <ModalButton
                onPress={() => navigation.navigate("Home")}
                color={colors.light}
                line={2}
                title="EXIT"
              />
            </View>
          </Modal>
          <View style={styles.shadow} />
        </>
      )}
      {route.params && route.params.mode && route.params.mode == "view" && (
        <>
          <NavigationButton
            style={[
              styles.next,
              {
                position: "absolute",
                bottom: insets.bottom,
                right: 30,
                zIndex: 10,
              },
            ]}
            onPress={() => next()}
            direction="right"
          />
          <View style={styles.shadow}>
            <Text style={{ color: colors.light, textAlign: "center" }}>
              Editing is disabled as this item has already been created
            </Text>
          </View>
        </>
      )}
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
export default NewItem;
