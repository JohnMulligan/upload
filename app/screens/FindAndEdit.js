import React, { useState } from "react";
import { View, Image, Button, Platform } from "react-native";
import Card from "../components/Card";
import ItemScreen from "../components/ItemScreen";
import Text from "../components/Text";

import { Formik } from "formik";

import * as axios from "axios";

function FindAndEdit({ navigation, route }) {
  const [length, setLength] = useState(2);
  const [fields, setFields] = useState(["Resource Template", "Resource Class"]);

  return (
    <ItemScreen
      exit={() => navigation.goBack()}
      style={{
        flex: 1,
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{route.params.item}</Text>
      {/* <Formik initialValues={title: ""} onSubmit={(values) => createItem(values)}>
        {({ handleBlur, handleSubmit, resetForm, values }) => (
          <>
            <Text style={{ paddingBottom: 2, paddingLeft: 2 }}>
              Resource Templates
            </Text>
            <View style={styles.picker}>
              <RNPickerSelect
                items={getItems()}
                onValueChange={(value, idx) => loadFields(value, idx)}
              />
            </View>

            {titles.map((title, idx) => (
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
            ))}
            <View
              style={{
                alignItems: "center",
                marginTop: 10,
                marginBottom: 50,
              }}
            >
              <Button onPress={handleSubmit} title="CREATE" />
            </View>
          </>
        )}
      </Formik> */}
    </ItemScreen>
  );
}

export default FindAndEdit;
