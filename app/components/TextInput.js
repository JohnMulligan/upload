import React, {useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Text from './Text';

import colors from '../config/colors';
import defaultStyles from '../config/styles';

function TInput({name, value, multiline, textColor = 'black', required, note, style, ...otherProps}) {
  return (
    <View style={styles.container, style}>
      <View style={{flexDirection: 'row'}}>
        {name && <Text style={{paddingBottom: 2, paddingLeft: 2}}>{name}</Text>}
        {required && <Text>*</Text>}
      </View>
      <TextInput multiline = {multiline && true} value = {value} autocorrect = {false} style={[{color: textColor}, styles.input]} {...otherProps} />
      
      {note && (
        <Text style={{fontSize: 12, color: colors.primary, padding: 2}}>
          {note}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    
  },
  input: {
    marginBottom: 5,
    borderRadius: 10,
    borderWidth: 2,
    padding: 5,
    paddingTop: 10,
    minHeight: 40,
    maxHeight: 200,
    paddingHorizontal: 10,
    borderColor: colors.primary,
    fontFamily: 'Barlow_400Regular',
  },
});

export default TInput;
