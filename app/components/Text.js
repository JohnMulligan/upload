import React from "react";
import { Text, View } from "react-native";

import defaultStyles from "../config/styles";

function AppText({ children, weight, style, ...otherProps }) {
  return (
    <View>
      {weight == "bold" ? (
        <Text style={[defaultStyles.boldtext, style]} {...otherProps}>
          {children}
        </Text>
      ) : weight == "light" ? (
        <Text style={[defaultStyles.lighttext, style]} {...otherProps}>
          {children}
        </Text>
      ) : weight == "medium" ? (
        <Text style={[defaultStyles.mediumtext, style]} {...otherProps}>
          {children}
        </Text>
      ) : weight == "italic" ? (
        <Text style={[defaultStyles.italictext, style]} {...otherProps}>
          {children}
        </Text>
      ) : (
        <Text style={[defaultStyles.text, style]} {...otherProps}>
          {children}
        </Text>
      )}
    </View>
  );
}

export default AppText;
