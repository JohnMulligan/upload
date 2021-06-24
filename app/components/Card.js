import React from 'react';
import {StyleSheet, TouchableOpacity, Dimensions, View} from 'react-native';
import Text from './Text';

const {width, height} = Dimensions.get('window');

import colors from '../config/colors';

function Card({title, onPress, color = 'primary', style, children, ...otherProps}) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} {...otherProps}>
      <View style={styles.header}>
        <Text weight="bold" style={styles.text}>
          {title}
        </Text>
        <View
          style={{width: '100%', height: 1, backgroundColor: colors.primary}}
        />
      </View>
      <View style={styles.children}>{children}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    borderColor: colors.primary,
    borderWidth: 1,
    width: 0.9 * width,
    height: 0.25 * height,
    marginBottom: 0.025*height
  },
  children: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: .02*height,
    height: 0.21*height,
    flexDirection: 'row'
  },
  header: {
    height: 0.03 * height,
    marginTop: .01 * height,
    marginHorizontal: .01 * height
  },
  text: {
    color: colors.primary,
    fontSize: 24,
  },
});

export default Card;
