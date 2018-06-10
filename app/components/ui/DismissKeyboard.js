import React from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';

const DismissKeyboard = props => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    {props.children}
  </TouchableWithoutFeedback>
);

export default DismissKeyboard;
