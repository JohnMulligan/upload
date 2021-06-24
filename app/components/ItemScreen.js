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

const ItemScreen = ({children, exit, style}) => {
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
    backgroundColor: colors.light,
  },
  view: {
    flex: 1,
    paddingTop: StatusBar.currentHeight + 40,
  },
  back: {
    marginTop: 40,
    width: 25,
    height: 25,
    position: 'absolute',
    zIndex: 5,
    right: 20,
    top: 20,
  },
});
export default ItemScreen;
