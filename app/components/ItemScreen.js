import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";

import colors from "../config/colors";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Wrapper for most of the pages in this app
const ItemScreen = ({ children, exit, style }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, style, {paddingTop: insets.top}]}>
      {exit && (
        <TouchableOpacity onPress={exit} style={styles.back}>
          <Image
            style={{ width: 20, height: 20 }}
            source={require("../config/Icons/close.png")}
          />
        </TouchableOpacity>
      )}
      {children}
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  back: {
    marginTop: 30,
    width: 25,
    height: 25,
    position: "absolute",
    zIndex: 11,
    right: 20,
    top: 20,
  },
});
export default ItemScreen;
