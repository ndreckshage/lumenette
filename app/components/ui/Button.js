import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import theme from 'app/lib/theme';

const buttonStyles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: theme.colorDarkBlue,
    paddingVertical: 13,
    paddingHorizontal: 30
  },
  disabled: {
    opacity: 0.4
  },
  buttonText: {
    color: theme.colorDarkBlue,
    fontFamily: theme.fontRegular,
    fontSize: 18,
    textAlign: 'center'
  },
  inline: {flexDirection: 'row'},
  onboarding: {
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  },
  onboardingText: {
    color: 'white'
  },
  danger: {
    borderColor: theme.colorRed
  },
  dangerText: {
    color: theme.colorRed
  },
  blue: {
    borderColor: theme.colorBlue,
    backgroundColor: theme.colorBlue
  },
  blueText: {
    color: 'white'
  }
});

const noop = () => {};

const Button = props => (
  <View
    style={[
      props.inline && buttonStyles.inline,
      (props.disabled || props.activity) && buttonStyles.disabled
    ]}
  >
    <TouchableOpacity
      style={[
        buttonStyles.button,
        props.variation === 'onboarding' && buttonStyles.onboarding,
        props.variation === 'danger' && buttonStyles.danger,
        props.variation === 'blue' && buttonStyles.blue
      ]}
      activeOpacity={props.disabled || props.activity ? 1 : 0.2}
      onPress={props.disabled || props.activity ? noop : props.onPress}
    >
      {props.activity ? (
        <ActivityIndicator size="small" color={theme.colorBlue} />
      ) : (
        <Text
          style={[
            buttonStyles.buttonText,
            props.variation === 'onboarding' && buttonStyles.onboardingText,
            props.variation === 'danger' && buttonStyles.dangerText,
            props.variation === 'blue' && buttonStyles.blueText
          ]}
        >
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  </View>
);

Button.defaultProps = {
  variation: 'standard',
  onPress: () => {}
};

export default Button;
