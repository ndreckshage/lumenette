import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { withRouter } from "react-router-native";
import {
  FormInput,
  Button,
  StatusBar,
  KeyboardScroll
} from "app/components/ui";
import theme from "app/lib/theme";
import { compose, connect, selectors, actions } from "app/core";

class VerifyPhone extends React.Component {
  state = {
    code: "",
    verifying: false
  };

  back = () => this.props.history.push("/onboarding/link-account");
  resend = () => this.props.resendVerification("phone");
  updateCode = code => this.setState({ code });
  skip = () => this.props.history.push("/main");
  next = () => {
    this.setState({ verifying: true });
    this.props.verifyPhoneNumber(this.state.code).then(success => {
      if (success) {
        this.props.history.push("/main");
      } else {
        this.setState({ verifying: false });
      }
    });
  };

  render() {
    const disabled = this.state.code.length !== 4;

    return (
      <View style={styles.contain}>
        <StatusBar backgroundColor={theme.colorBlue} barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.leftContain}>
            <TouchableOpacity onPress={this.back} style={styles.leftButton}>
              <Image
                style={styles.arrowLeft}
                source={require("app/assets/images/icons/arrow-left-white.png")}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>Confirm Phone</Text>
          <View style={styles.leftContain} />
        </View>
        <KeyboardScroll extraHeight={100}>
          <View style={styles.content}>
            <View style={styles.upperTextContain}>
              <Text style={styles.upperText}>
                Enter the confirmation code from the text we sent to{" "}
                {this.props.phone}.
              </Text>
            </View>
            <View style={styles.form}>
              <FormInput
                label="Confirmation Code"
                placeholder="####"
                onChangeText={this.updateCode}
                value={this.state.code}
                rightText={
                  <TouchableOpacity onPress={this.resend}>
                    <Text style={styles.resend}>Resend</Text>
                  </TouchableOpacity>
                }
                keyboardType="numeric"
                autoFocus
              />
              <Button
                title="Next!"
                activity={this.state.verifying}
                disabled={disabled}
                onPress={this.next}
              />
              <TouchableOpacity onPress={this.skip}>
                <Text style={styles.skip}>Skip / Validate Later</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardScroll>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: { flex: 1 },
  header: {
    backgroundColor: theme.colorBlue,
    padding: 10,
    flexDirection: "row"
  },
  headerText: {
    fontFamily: theme.fontRegular,
    fontSize: 24,
    color: "white",
    flex: 3,
    textAlign: "center"
  },
  leftContain: { flex: 1 },
  leftButton: {
    flex: 1,
    width: "100%",
    paddingLeft: 5,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  content: { padding: 20 },
  upperTextContain: { marginBottom: 20 },
  upperText: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue
  },
  resend: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    textDecorationLine: "underline"
  },
  skip: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 15
  },
  form: {}
});

export default compose(
  withRouter,
  connect(
    state => ({
      phone: selectors.selectPhone(state)
    }),
    {
      verifyPhoneNumber: actions.verifyPhoneNumber,
      resendVerification: actions.resendVerification
    }
  )
)(VerifyPhone);
