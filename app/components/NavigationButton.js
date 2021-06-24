import React from 'react';
import {StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import Text from './Text';
import Icon from "./Icon";

import colors from '../config/colors';

//direction takes 2 values: left and right
//default direction is right
function NavigationButton({label, direction, onPress, style}) {
  return (
    <View style = {style}>
      <Text style = {{width: 50, textAlign: 'center'}}>{label}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Image style = {{width: 30, height: 30}} source = {direction == "left" ? require("../config/Icons/move-to-last.png") : require("../config/Icons/move-to-next.png")}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: 50,
    height: 50,
  },
  text: {
    color: colors.light,
    fontSize: 18,
  },
});

export default NavigationButton;
