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
import { Formik } from "formik";

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

function NewItem({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const { item, setItem } = useContext(ItemContext);

  const [length, setLength] = useState(2);
  const [resourceTemplates, setResourceTemplates] = useState([]);
  const [templateId, setTemplateId] = useState([]);
  const [options, setOptions] = useState([]);
  const [templateSelected, setTemplateSelected] = useState("");
  const [modal, setModal] = useState(false);
  const [data, setData] = useState([]);
  const [titles, setTitles] = useState([]);
  const [IDs, setIDs] = useState([]);
  const [types, setTypes] = useState({});
  const [values, setValues] = useState({});

  let empty = {};

  useEffect(() => {
    let isMounted = true;
    fetchResourceTemplates(user[0])
      .then((response) => {
        if (isMounted) setResourceTemplates(response);
      })
      .catch((error) => console.log(error));
    return () => {
      isMounted = false;
    };
  }, []);

  const loadFields = async (value, idx) => {
    console.log(value, idx);
    setValues({});
    setTemplateSelected(value);
    setTemplateId(idx);
    //voids "Select an item"
    if (idx != 0) {
      setTitles(
        await getPropertiesInResourceTemplate(user[0], idx).then((res) =>
          res.map((prop, idx) => prop.data["o:label"])
        )
      );
      setTypes(
        await getPropertiesInResourceTemplate(user[0], idx).then((res) =>
          res.map((prop, idx) => prop.data)
        )
      );
      await getPropertiesInResourceTemplate(user[0], idx).then((res) =>
        res.map((type) => (values[type] = ""))
      );
      setIDs(await getPropertyIds(user[0], idx).then((res) => res));
    }
  };

  const next = () => {
    setModal(true);
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
      })
    );
    return templates;
  };

  const createItem = () => {
    let payload = {};
    let title = values[titles[0]];
    console.log("title", title);

    let v = IDs.map((id, idx) => [
      {
        type: "literal",
        property_id: id,
        property_label: titles[idx],
        "@value": values[titles[idx]],
      },
    ]);
    IDs.map((id, idx) => (payload[types[idx]["o:term"]] = v[idx]));
    payload["o:resource_template"] = {
      "@id": `http://${user[0]}/api/resource_templates/${templateId}`,
      "o:id": templateId,
    };
    let templates = getItems()[0];
    payload["o:resource_class"] = {
      "o:id": templates.class,
    };
    SecureStore.getItemAsync(user[1])
      .then((res) =>
        axios
          .post(`http://${user[0]}/api/items`, payload, {
            params: {
              key_identity: user[1],
              key_credential: res,
            },
          })
          .then((response) => {
            console.log(response.data);
            setItem([response.data["o:id"], user]);
            setModal(true);
          })
          .catch((error) => {
            console.log("error");
          })
      )
      .catch((error) => console.log("credentials failed", error));
  };

  const handleChangeText = (title, value, id) => {
    values[title + ""] = value;
    setValues({ ...values });
  };

  return (
    <ItemScreen
      style={{ flex: 1 }}
      exit={() => navigation.navigate("Quick Start")}
    >
      <Header title="Create New Item" />
      <ScrollView style={styles.body}>
        <Formik initialValues={types} onSubmit={(values) => createItem(values)}>
          {({ handleBlur, handleSubmit, resetForm, values }) => (
            <View>
              <Text style={{ paddingBottom: 2, paddingLeft: 2 }}>
                Resource Templates
              </Text>
              <View style={styles.picker}>
                <RNPickerSelect
                  items={getItems()}
                  onValueChange={(value, idx) => loadFields(value, idx)}
                />
              </View>
              {templateSelected ? (
                <>
                  {titles.map((title, idx) => (
                    <TextInput
                      onChangeText={(value) =>
                        handleChangeText(title, value, IDs[idx])
                      }
                      name={title}
                      id={IDs[idx]}
                      value={values[title + ""]}
                      key={idx}
                    />
                  ))}
                </>
              ) : (
                <View>
                  <Text>Please select a Resource Template to get started.</Text>
                </View>
              )}

              <Button
                theme="dark"
                style={{
                  width: 0.7 * width,
                  marginHorizontal: 0.1 * width,
                  marginTop: 50,
                }}
                title="CREATE ITEM"
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
      </ScrollView>
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
                onPress={() => navigation.navigate("Quick Start")}
                color={colors.light}
                line={2}
                title="EXIT"
              />
            </View>
          </Modal>
          <View style={styles.shadow} />
        </>
      )}
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
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
    backgroundColor: colors.gray,
    zIndex: 5,
  },
  next: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});
export default NewItem;
