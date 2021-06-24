import React, {useState} from 'react';
import {Text, StyleSheet, View, TextInput, Button} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Icon = ({ name, iconColor = "black", size = 20 }) => {
  return (
    <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons name={name} color={iconColor} size={size * 0.5} />
        </View>
  );
};
const styles = StyleSheet.create({
  //Check project repo for styles
});

export default Icon;

