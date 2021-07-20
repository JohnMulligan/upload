import React, { useState, useContext } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import colors from "../config/colors";
import Text from "../components/Text";

import Logo from "../config/Icons/SClogo.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import { KeyboardAccessoryNavigation } from "react-native-keyboard-accessory";

//authorization
import AuthContext from "../../api/auth/context";
import * as SecureStore from "expo-secure-store";

//api
import * as axios from "axios";
import { Formik } from "formik";
import ErrorMessage from "../components/ErrorMessage";

const { width, height } = Dimensions.get("window");

function Connect({ navigation }) {
  const insets = useSafeAreaInsets();

  const { user, setUser } = useContext(AuthContext);

  const [rememberLogin, setRememberLogin] = useState(false);
  const [showData, setShowData] = useState("");
  const [invalidkeys, setInvalidKeys] = useState(false);
  const [invalidhost, setInvalidHost] = useState(false);

  //move to a separate authentication file
  async function storeUserSession(host, identity, credential) {
    await SecureStore.setItemAsync("keys", `${identity},${credential}`);
    await SecureStore.setItemAsync("host", host);
    setUser(true);
  }

  const sendTest = (values) => {
    console.log("sending test");
    let payload = {
      "dcterms:title": [
        {
          type: "literal",
          property_id: 1,
          property_label: "Title",
          "@value": "[NEED DELETION] Item for Authentication",
        },
      ],
      "dcterms:abstract": [
        {
          type: "literal",
          property_id: 19,
          property_label: "Abstract",
          is_public: true,
          "@value":
            "If you have found this item in the dashboard, please feel free to delete it.",
        },
      ],
    };
    axios
      .post("http://" + values.ip_address + "/api/items", payload, {
        params: {
          key_identity: values.key_identity,
          key_credential: values.key_credential,
        },
      })
      .then((response) => {
        console.log("success");

        axios.delete(
          "http://" + values.ip_address + "/api/items/" + response.data["o:id"],
          {
            params: {
              key_identity: values.key_identity,
              key_credential: values.key_credential,
            },
          }
        );
        storeUserSession(
          values.ip_address,
          values.key_identity,
          values.key_credential
        );
      })
      //403: invalid keys
      //anything else: invalid IP address
      .catch(err => {
    if (err.response) {
      // client received an error response (5xx, 4xx)
      console.log('1')
      setInvalidKeys(true)
      setInvalidHost(false)
    } else if (err.request) {
      // client never received a response, or request never left
      console.log('2')
      setInvalidHost(true)
      setInvalidKeys(false)
    } else {
      console.log('3')
      // anything else
    }
})
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={[styles.screen, { paddingTop: insets.top + 25 }]}
    >
      <View style={styles.inner}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../config/Icons/SClogo.png")}
            style={{ height: 100, resizeMode: "contain" }}
          />
        </View>

        <Formik
          initialValues={{
            ip_address: "",
            key_identity: "",
            key_credential: "",
          }}
          onSubmit={(values) => sendTest(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            touched,
            values,
          }) => (
            <View>
              <TextInput
                name="ip_address"
                onChangeText={handleChange("ip_address")}
                value={values.ip_address}
                required={true}
                note={'leave out "http://" and do not end with a "/"'}
              />
              {errors.ip_address && touched.ip_address && (
                <Text
                  weight="bold"
                  style={{ color: colors.primary, fontSize: 14 }}
                >
                  {errors.ip_address}
                </Text>
              )}
              <ErrorMessage
                error="Invalid host IP address"
                visible={invalidhost}
              />
              <TextInput
                name="key_identity"
                onChangeText={handleChange("key_identity")}
                value={values.key_identity}
              />
              <TextInput
                name="key_credential"
                note={
                  "key info found at Omeka admin dashboard -> User -> API keys"
                }
                secureTextEntry
                onChangeText={handleChange("key_credential")}
                value={values.key_credential}
              />
              <ErrorMessage error={"Invalid API keys"} visible={invalidkeys} />

              {/* hasn't been implemented yet
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setRememberLogin(!rememberLogin)}
              style={styles.checkContainer}
            >
              <Text
                weight="medium"
                style={{ marginRight: 5, color: colors.primary }}
              >
                remember login
              </Text>
              <View
                style={[
                  styles.checkbox,
                  rememberLogin && { backgroundColor: colors.primary },
                ]}
              />
            </TouchableOpacity> */}

              <Button
                theme="dark"
                style={{
                  width: 0.7 * width,
                  marginHorizontal: 0.1 * width,
                  marginTop: 50,
                  marginBottom: 50
                }}
                title="CONNECT"
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 0.05 * width,
    backgroundColor: colors.light,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 5,
  },
  checkContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  inner: {
    justifyContent: "flex-end",
  },
});

export default Connect;
