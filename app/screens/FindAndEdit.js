import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Platform,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Card from "../components/Card";
import ItemScreen from "../components/ItemScreen";
import Text from "../components/Text";
import Button from "../components/Button";
import RNPickerSelect from "react-native-picker-select";
import * as SecureStore from "expo-secure-store";
import TextInput from "../components/TextInput";

import { Formik } from "formik";
import colors from "../config/colors";

import * as axios from "axios";

import {
  fetchOne,
  fetchResourceTemplates,
  fetchProperties,
  getPropertiesInResourceTemplate,
  getPropertyIds,
  getResourceTemplate,
  fetchItemData,
} from "../../api/utils/Omeka";
const { width, height } = Dimensions.get("window");

function FindAndEdit({ navigation, route }) {
  const [item, setItem] = useState(2);
  const [values, setValues] = useState({});

  const [host, setHost] = useState("");

  const [itemData, setItemData] = useState({});
  const [fields, setFields] = useState({});
  const [resourceTemplates, setResourceTemplates] = useState([]);
  const [resourceTemplate, setResourceTemplate] = useState("");
  const [loading, setLoading] = useState(true);

  const [titles, setTitles] = useState([]);
  const [types, setTypes] = useState({});
  const [IDs, setIDs] = useState([]);

  const getResourceTemplates = () => {
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

  //load all resource templates
  useEffect(() => {
    let isMounted = true;
    setItem(route.params.item);
    SecureStore.getItemAsync("host").then((host) => {
      setHost(host);
      fetchResourceTemplates(host)
        .then((response) => {
          if (isMounted) setResourceTemplates(response);
        })
        .catch((error) => console.log(error));
      return () => {
        isMounted = false;
      };
    });
  }, []);

  //load item's resource template
  //TO DO: replace hardcoded host address
  useEffect(() => {
    if (!resourceTemplate) {
      console.log("1");
      SecureStore.getItemAsync("host").then((host) => {
        getResourceTemplate(
          host,
          route.params.item["o:resource_template"]["o:id"]
        ).then((res) => {
          console.log(res.data["o:label"]);
          setResourceTemplate(res.data["o:label"]);
        });
      });
    }
  });

  //load item data
  useEffect(() => {
    SecureStore.getItemAsync("host").then((host) => {
      SecureStore.getItemAsync("keys").then((keys) => {
        fetchItemData(host, "items", route.params.item["o:id"], {
          key_identity: keys.split(",")[0],
          key_credential: keys.split(",")[1],
        })
          .then((res) => {
            if (loading == true) {
              var fields = {};
              res.map((prop, idx) => (fields[prop[0]] = prop[1]));
              console.log(fields);
              setValues(fields);
              setItemData(res);
              setLoading(false);
            }
          })
          .catch((error) => console.log("error", error));
      });
    });
  });

  const getTemplates = () => {
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

  const loadFields = async (value, idx) => {
    console.log(value, idx);
    setValues({});
    setResourceTemplate(value);
    const id = route.params.item["o:resource_template"]["o:id"];
    //voids "Select an item"
    if (idx != 0) {
      setTitles(
        await getPropertiesInResourceTemplate(host, id).then((res) =>
          res.map((prop) => prop.data["o:label"])
        )
      );
      setTypes(
        await getPropertiesInResourceTemplate(host, id).then((res) =>
          res.map((prop) => prop.data)
        )
      );
      await getPropertiesInResourceTemplate(host, id).then((res) =>
        res.map((type) => (values[type] = ""))
      );
      setIDs(await getPropertyIds(host, id).then((res) => res));
    }
  };

  const handleChangeText = (title, value, id) => {
    values[title + ""] = value;
    setValues({ ...values });
  };

  return (
    <ItemScreen
      exit={() => navigation.goBack()}
      style={{
        flex: 1,
        padding: 15,
        alignItems: "center",
      }}
    >
      <Text
        weight="medium"
        style={{ fontSize: 24, marginTop: 30, marginBottom: 15 }}
      >
        {/* Editing {item["o:title"]} */}
        Editing disabled
      </Text>
      {/* {!loading ? (
        <Formik initialValues={fields} onSubmit={(values) => editItem(values)}>
          {({ handleBlur, handleSubmit, resetForm, values }) => (
            <ScrollView style={{ width: "95%" }}>
              <Text style={{ paddingBottom: 2, paddingLeft: 2 }}>
                Resource Templates
              </Text>
              <View style={styles.picker}>
                <RNPickerSelect
                  items={getResourceTemplates()}
                  value={resourceTemplate}
                  onValueChange={(value, idx) => loadFields(value, idx)}
                />
              </View>
              {titles
                ? titles.map((title, idx) => (
                    <TextInput
                      onChangeText={(value) =>
                        handleChangeText(title, value, IDs[idx])
                      }
                      multiline={false}
                      name={title}
                      id={IDs[idx]}
                      value={values[title + ""]}
                      key={idx}
                    />
                  ))
                : itemData.map((title, idx) => (
                    <TextInput
                      onChangeText={(value) => console.log(value)}
                      name={title[0]}
                      value={title[1]}
                    />
                  ))}
              <View
                style={{
                  alignItems: "center",
                  marginTop: 10,
                  marginBottom: 50,
                }}
              >
                <Button onPress={handleSubmit} title="DONE" />
              </View>
            </ScrollView>
          )}
        </Formik>
      ) : (
        <Text>Loading...</Text>
      )} */}
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

export default FindAndEdit;
