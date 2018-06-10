import React from 'react';
import {
  Dimensions,
  Platform,
  View,
  StatusBar as RNStatusBar
} from 'react-native';

const isIphoneX = () => {
  const dimen = Dimensions.get('window');
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812)
  );
};

const getStatusBarHeight = () =>
  Platform.OS === 'ios' ? (isIphoneX() ? 44 : 20) : StatusBar.currentHeight;

const StatusBar = props => (
  <View
    style={{
      height: getStatusBarHeight(),
      width: '100%',
      backgroundColor: props.backgroundColor,
      zIndex: 10
    }}
  >
    <RNStatusBar
      backgroundColor={props.backgroundColor}
      barStyle={props.barStyle}
    />
  </View>
);

StatusBar.defaultProps = {
  backgroundColor: 'white',
  barStyle: 'dark-content'
};

export default StatusBar;
