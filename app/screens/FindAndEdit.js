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

import { Formik } from "formik";
import colors from "../config/colors";

import * as axios from "axios";

import { fetchResourceTemplates, getResourceTemplate } from "../../api/utils/Omeka";
const { width, height } = Dimensions.get("window");

function FindAndEdit({ navigation, route }) {
  const [item, setItem] = useState(2);
  const [fields, setFields] = useState(["Resource Template", "Resource Class"]);
  const [resourceTemplates, setResourceTemplates] = useState([]);
  const [resourceTemplate, setResourceTemplate] = useState("");

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

  useEffect(() => {
    let isMounted = true;
    setItem(route.params.item)
    SecureStore.getItemAsync("host").then((host) => {
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

  useEffect(() => {
    getResourceTemplate("158.101.99.206", route.params.item["o:resource_template"]["o:id"]).
    then(res => setResourceTemplate(res.data["o:label"]));
  })

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
        Editing {item["o:title"]}
      </Text>
      <Formik
        initialValues={{ title: "" }}
        onSubmit={(values) => createItem(values)}
      >
        {({ handleBlur, handleSubmit, resetForm, values }) => (
          <ScrollView style={{ width: "95%" }}>
            <Text style={{ paddingBottom: 2, paddingLeft: 2 }}>
              Resource Templates
            </Text>
            <View style={styles.picker}>
              <RNPickerSelect
                items={getResourceTemplates()}
                value={resourceTemplate}
                onValueChange={(value, idx) => console.log("value", value)}
              />
            </View>

            {/* {titles.map((title, idx) => (
              <TextInput
                onChangeText={(value) =>
                  handleChangeText(title, value, IDs[idx])
                }
                multiline={true}
                name={title}
                id={IDs[idx]}
                value={values[title + ""]}
                key={idx}
              />
            ))} */}
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
