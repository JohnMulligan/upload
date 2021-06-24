import React, { useState } from "react";
import { View, Image, Button, Platform } from "react-native";
import Card from "../components/Card";
import Screen from "../components/Screen";
import Text from "../components/Text";

import * as axios from "axios";

function FindAndEdit({ navigation }) {
  const [length, setLength] = useState(2);
  const [fields, setFields] = useState(["Resource Template", "Resource Class"]);

  return (
    <Screen back={() => navigation.goBack()} style={{ flex: 1, padding: 15 }}>
      <Button title="Find and Edit" />
    </Screen>
  );
}

export default FindAndEdit;
