import React from 'react';
import {StyleSheet, TouchableOpacity, Dimensions, View} from 'react-native';
import Text from './Text';

const {width, height} = Dimensions.get('window');

import colors from '../config/colors';

function Card({title, onPress, color = 'primary', style, children, ...otherProps}) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...otherProps}>
      <View style={styles.header}>
        <Text weight="medium" style={styles.text}>
          {title}
        </Text>
      </View>
      <View style={styles.children}>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    borderColor: colors.blue,
    borderWidth: 2,
    width: 0.9 * width,
    marginBottom: 0.025*height,
  },
  children: {
    alignItems: 'center',
    margin: .01 * height,
    flexDirection: 'row'
  },
  header: {
    marginTop: .01 * height,
    marginHorizontal: .01 * height,
  },
  text: {
    color: colors.primary,
    fontSize: 18,
  },
});

export default Card;
