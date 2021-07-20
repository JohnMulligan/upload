import React, { useState } from "react";
import { View, Image, Button, Platform } from "react-native";
import Card from "../components/Card";
import ItemScreen from "../components/ItemScreen";
import Text from "../components/Text";

import * as axios from "axios";

function FindAndEdit({ navigation }) {
  const [length, setLength] = useState(2);
  const [fields, setFields] = useState(["Resource Template", "Resource Class"]);

  return (
    <ItemScreen exit={() => navigation.goBack()} style={{ flex: 1, padding: 15, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Sorry, this feature isn't available yet.</Text>
    </ItemScreen>
  );
}

export default FindAndEdit;
