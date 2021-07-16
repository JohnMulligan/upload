import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Card from '../components/Card';
import Header from '../components/Header';
import ItemScreen from '../components/ItemScreen';
import TextInput from '../components/TextInput';
import Text from '../components/Text';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import ModalButton from '../components/ModalButton';
import NavigationButton from '../components/NavigationButton';
import Button from '../components/Button';

import colors from '../config/colors';

import {fetchResourceTemplates} from '../../api/utils/Omeka';
import * as axios from 'axios';

const {width, height} = Dimensions.get('window');

function Confirm({navigation}) {
  const [length, setLength] = useState(2);
  const [resourceTemplates, setResourceTemplates] = useState([]);
  const [options, setOptions] = useState([]);
  const [templateSelected, setTemplateSelected] = useState('');
  const [modal, setModal] = useState(false);

  let templates = [];

  const fields = [
    {
      name: '',
      required: false,
      value: '',
      placeholder: '',
    },
  ];

  const [selectedValue, setSelectedValue] = useState('java');

  useEffect(() => {
    fetchResourceTemplates('158.101.99.206')
      .then(response =>
        response.map(item =>
          templates.push({label: item['o:label'], value: item['o:label']}),
        ),
      )
      .catch(error => console.log(error));
  });

  const loadFields = (value, idx) => {
    console.log(value, idx);
  };

  const skip = () => {
    setModal(true);
  };

  return (
    <ItemScreen
      style={{flex: 1}}
      exit={() => navigation.navigate('Home')}>
      <Header title="Confirm" />
      <View style={styles.body}>
        <Text>Item Metadata</Text>
        
          <Button title="CONFIRM" />
        {modal && (
          <>
            <Modal title="Are you sure you don't want to add any media?">
              <View style={styles.children}>
                <ModalButton
                  onPress={() =>
                    navigation.navigate('Create Item', {screen: 'Confirm'})
                  }
                  line={2}
                  title="YES, MOVE ON"
                />
                <ModalButton
                  onPress={() => setModal(false)}
                  color={colors.light}
                  line={2}
                  title="NO, GO BACK"
                />
              </View>
            </Modal>
            <View style={styles.shadow} />
          </>
        )}
      </View>
      <NavigationButton
        onPress={() => navigation.goBack()}
        label="Back"
        direction="left"
        style={styles.back}
      />
    </ItemScreen>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: colors.blue,
    height: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
  },
  icon: {
    position: 'absolute',
    zIndex: 5,
  },
  picker: {
    borderRadius: 10,
    borderWidth: 2,
    padding: 5,
    height: 40,
    paddingHorizontal: 10,
    borderColor: colors.primary,
    justifyContent: 'center',
    marginBottom: 5,
  },
  children: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  shadow: {
    position: 'absolute',
    top: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: width,
    height: height,
    backgroundColor: colors.gray,
  },
  next: {
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  back: {
    position: 'absolute',
    bottom: 30,
    left: 30,
  },
});
export default Confirm;
