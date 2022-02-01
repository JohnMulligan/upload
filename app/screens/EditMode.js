import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Platform,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import Button from "../components/Button";
import ItemCard from "../components/ItemCard";
import ItemScreen from "../components/ItemScreen";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import Text from "../components/Text";
import TextInput from "../components/TextInput";
import { fetchItemData, getThumbnail } from "../../api/utils/Omeka";
import Modal from "../components/Modal";
import ModalButton from "../components/ModalButton";

import * as axios from "axios";
import { Formik, useFormikContext } from "formik";

import * as SecureStore from "expo-secure-store";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import colors from "../config/colors";

import {
  fetchResourceTemplates,
  getPropertiesInResourceTemplate
} from "../../api/utils/Omeka";

const { width, height } = Dimensions.get("window");

function EditMode({ navigation, item, switchMode }) {
  const [properties, setProperties] = useState([]);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [modal, setModal] = useState(false);

  const [warning, setWarning] = useState();
  useEffect(() => {
    itemValues = {};
    //if there is no assigned resource_template, the page should not load and
    //a warning should indicate that the user needs to go to Omeka and add a template
    //before being able to edit this item.
    if (!item["o:resource_template"])
      setWarning(
        "Editing disabled. Please select a resource template for this item to edit."
      );
    else
      SecureStore.getItemAsync("host").then((host) => {
        setHost(host);
        SecureStore.getItemAsync("keys").then((keys) => {
          //this gets the titles ("o:label") of each field in the resource template
          //and sets it to properties
          console.log(item["o:id"]);
          fetchItemData(host, "items", item["o:id"], {
            key_identity: keys.split(",")[0],
            key_credential: keys.split(",")[1],
          })
            .then((res) => {
              if (loading) {
                //match all properties to filled out item fields
                getPropertiesInResourceTemplate(
                  host,
                  item["o:resource_template"]["o:id"],
                  {
                    key_identity: keys.split(",")[0],
                    key_credential: keys.split(",")[1],
                  }
                ).then((itemRes) => {
                  for (property of itemRes.map((item) => item["data"])) {
                    // console.log('property', property)
                    itemValues[property["o:label"]] = [
                      property["o:label"],
                      " ",
                      property["o:id"],
                      property["o:term"],
                    ];
                  }
                  res.map((chunk) => (itemValues[chunk[0]] = chunk));
                  setProperties(itemValues);
                });
                setLoading(false);
              }
            })
            .catch((error) => console.log("error", error));
        });
      });
  });

  const handleChangeText = (prop, idx, value) => {
    properties[prop][1] = value; 
    setProperties({ ...properties });
  };

  const createItem = () => {
    let payload = {};
    let title = properties["Title"][1];
    let v = Object.values(properties).map(
      (prop, idx) =>
        prop[0] != "Title" &&
        prop[0] != "id" &&
        (payload[prop[3]] = [
          {
            type: "literal",
            property_id: prop[2],
            property_label: prop[0],
            "@value": prop[1],
            is_public: false,
          },
        ])
    );
    console.log(payload);
    //hardcoded...but what if they use a different title term?
    payload["dcterms:title"] = [
      {
        type: "literal",
        property_id: 1,
        property_label: "Title",
        "@value": properties["Title"][1],
        is_public: false,
      },
    ];
    SecureStore.getItemAsync("keys")
      .then((keys) => {
        axios
          .patch(
            `http://${host}/api/items/${properties["id"][1]}?key_identity=${
              keys.split(",")[0]
            }&key_credential=${keys.split(",")[1]}`,
            payload
          )
          .then((res) => setModal(true))
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log("credentials failed", error));
  };

  return (
    <View
      exit={() => navigation.goBack()}
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <View
        style={{
          marginTop: 50,
          width: "90%",
        }}
      >
        <Text weight="italic" style={{ textAlign: "center" }}>
          Editing
        </Text>
        <Text
          weight="bold"
          style={{ textAlign: "center", fontSize: 28, marginBottom: 20 }}
        >
          {item["o:title"]}
        </Text>
        {loading ? (
          warning ? 
          <Text>
            Editing disabled...Please select a resource template for this class
            to continue.
          </Text> : <Text>Loading...</Text>
        ) : (
          <KeyboardAwareScrollView style={{ height: height - 130 }}>
            <View>
              {Object.keys(properties).map((prop, idx) => (
                <>
                  {prop != "Title" &&
                    prop != "id" && (
                      <View key={idx}>
                        <TextInput
                          onChangeText={(value) =>
                            handleChangeText(prop, idx, value)
                          }
                          multiline={true}
                          name={prop}
                          id={properties[prop][2]}
                          key={idx + 1}
                          value={properties[prop][1]}
                        />
                      </View>
                    )
                  }
                  {idx == Object.keys(properties).length - 2 && (
                    <View
                      key = {idx + 2}
                      style={{
                        alignItems: "center",
                        marginBottom: 50,
                      }}
                    >
                      <Button
                        key = {idx + 3}
                        onPress={() => createItem()}
                        title="SAVE CHANGES"
                      />
                    </View>
                  )}
                </>
              ))}
            </View>
          </KeyboardAwareScrollView>
        )}
      </View>
      {modal && (
        <>
          <Modal title="Item modified!">
            <View style={styles.children}>
              <ModalButton
                onPress={() => switchMode("image")}
                line={2}
                title="UPLOAD MEDIA"
              />
              <ModalButton
                onPress={() => navigation.goBack()}
                color={colors.light}
                line={2}
                title="EXIT"
              />
            </View>
          </Modal>
        </>
      )}
    </View>
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
  next: {
    position: "absolute",
  },
});
export default EditMode;
