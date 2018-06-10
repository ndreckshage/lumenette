import React from "react";
import { TextInput, Text, View, StyleSheet } from "react-native";
import theme from "app/lib/theme";

const noop = () => {};

const FormInput = props => (
  <View style={styles.contain}>
    <View style={styles.labelContain}>
      <Text style={styles.label}>{props.label}</Text>
      {props.rightText}
    </View>
    <View style={props.rowButton && styles.rowButton}>
      <TextInput
        style={[
          styles.input,
          props.height && { height: props.height },
          props.rowButton && styles.rowButtonInput,
          !props.editable && styles.disabled
        ]}
        autoCapitalize={props.autoCapitalize || "none"}
        placeholderTextColor={theme.colorPlaceholder}
        placeholder={props.placeholder || ""}
        onChangeText={props.onChangeText || noop}
        underlineColorAndroid="rgba(0,0,0,0)"
        numberOfLines={props.numberOfLines || 1}
        multiline={!!props.multiline || !!props.height || false}
        {...props}
      />
      {props.rowButton}
    </View>
  </View>
);

FormInput.defaultProps = {
  editable: true
};

const styles = StyleSheet.create({
  contain: {
    marginBottom: 20
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   flex: 1
  },
  labelContain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5
  },
  label: {
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue,
    fontSize: 18
  },
  input: {
    fontSize: 16,
    borderColor: theme.colorLightBorder,
    borderRadius: 4,
    borderWidth: 1,
    padding: 10,
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue
  },
  disabled: {
    backgroundColor: "#fafafa"
  },
  rowButton: {
    flexDirection: "row"
  },
  rowButtonInput: {
    flex: 1,
    marginRight: 10
  }
});

export default FormInput;
