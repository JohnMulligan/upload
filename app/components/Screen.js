import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';

import colors from '../config/colors';

const Screen = ({children, exit, style}) => {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>
        {exit && (
          <TouchableOpacity onPress={exit} style={styles.back}>
            <Image
              style={{width: 20, height: 20}}
              source={require('../config/Icons/close.png')}
            />
          </TouchableOpacity>
        )}
        {children}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: colors.light,
  },
  view: {
    flex: 1,
  },
  back: {
    width: 25,
    height: 25,
    position: 'absolute',
    zIndex: 5,
    right: 20,
    top: 20,
  },
});
export default Screen;
