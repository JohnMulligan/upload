import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from './Text';

import colors from '../config/colors';

//line = # of buttons on a line. ex if there should be 2 buttons on a line they will both take up half of the space
//default line = 1
function ModalButton({title, onPress, line, color = colors.blue, style}) {
  return (
    <TouchableOpacity
      style={[
        line == 2 ? {width: '48%'} : {width: '100%'}, {borderColor: color},
        styles.button,
        style,
      ]}
      onPress={onPress}>
      <View style={styles.buttonContainer}>
        <Text weight="medium" style={[{color: color}, styles.text]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    padding: 5,
    minHeight: 50
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
  },
});

export default ModalButton;
