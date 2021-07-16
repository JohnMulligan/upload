import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import Text from "./Text";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

import colors from "../config/colors";

const Screen = ({ children, header, exit, style }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, style]}>
      {/* {header && (
        <View
          style={{
            position: "absolute",
            width: width,
            height: height - 40 - insets.top,
            backgroundColor: colors.blue,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            padding: 25,
            bottom: 0,
          }}
        />
      )} */}
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        {header && (
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: 'row'
            }}
          >
            <Text
              weight="medium"
              style={{
                fontSize: 28,
              }}
            >
              {header}
            </Text>
            {exit && (
              <TouchableOpacity onPress={exit} style={styles.back}>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require("../config/Icons/close.png")}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={{ marginTop: 20 }}>{children}</View>
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
    alignItems: "center",
    width: width,
  },
  back: {
    width: 25,
    height: 25,
  },
});
export default Screen;
