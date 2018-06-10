import React from "react";

import Button from "app/components/ui/Button";
import StatusBar from "app/components/ui/StatusBar";
import RouteTransition from "app/components/ui/RouteTransition";
import FormInput from "app/components/ui/FormInput";
import SimpleHeader from "app/components/ui/SimpleHeader";
import ExpandableKey from "app/components/ui/ExpandableKey";
import DismissKeyboard from "app/components/ui/DismissKeyboard";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TextLink from "app/components/ui/TextLink";

const KeyboardScroll = props => (
  <KeyboardAwareScrollView
    {...props}
    ref={props.kbRef}
    keyboardShouldPersistTaps="handled"
  />
);

export {
  Button,
  StatusBar,
  RouteTransition,
  FormInput,
  SimpleHeader,
  ExpandableKey,
  DismissKeyboard,
  KeyboardScroll,
  TextLink
};
