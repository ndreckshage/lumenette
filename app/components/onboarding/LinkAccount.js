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
import * as patterns from "app/lib/regex";
import { compose, connect, selectors, actions } from "app/core";
import { updateUserInfo } from "app/core/actions/updateUserInfo";
import normalizePhone from "app/core/lib/normalizePhone";

class LinkAccount extends React.Component {
  state = {
    firstName: this.props.firstName,
    lastName: this.props.lastName,
    phone: this.props.phone,
    email: this.props.email,
    submitting: false
  };

  update = k => v => this.setState({ [k]: v });

  render() {
    const phoneValid = normalizePhone(this.state.phone);
    const emailValid = this.state.email.match(patterns.email);
    const emailPass = !this.state.email || emailValid;

    const disabled =
      this.state.firstName.length === 0 ||
      this.state.lastName.length === 0 ||
      !phoneValid ||
      !emailPass;

    return (
      <View style={styles.contain}>
        <StatusBar backgroundColor={theme.colorBlue} barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.leftContain}>
            <TouchableOpacity
              onPress={() =>
                this.props.history.push("/onboarding/account-created")
              }
              style={styles.leftButton}
            >
              <Image
                style={styles.arrowLeft}
                source={require("app/assets/images/icons/arrow-left-white.png")}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>Link Email or Phone</Text>
          <View style={styles.leftContain} />
        </View>
        <KeyboardScroll extraHeight={100} extraScrollHeight={20}>
          <View style={styles.content}>
            <View style={styles.upperTextContain}>
              <Text style={styles.upperText}>
                Enter information to be discoverable amongst contacts, and/or
                claim a transfer you were notified about! 🚀
              </Text>
            </View>
            <View style={styles.form}>
              <View style={styles.nameContain}>
                <View style={[styles.nameInner, { marginRight: 5 }]}>
                  <FormInput
                    label="First"
                    placeholder="John or Jane"
                    onChangeText={this.update("firstName")}
                    value={this.state.firstName}
                    editable={!this.props.firstName}
                    autoCapitalize="words"
                  />
                </View>
                <View style={[styles.nameInner, { marginLeft: 5 }]}>
                  <FormInput
                    label="Last"
                    placeholder="Doe"
                    onChangeText={this.update("lastName")}
                    value={this.state.lastName}
                    editable={!this.props.lastName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
              <FormInput
                label="Phone Number"
                placeholder="(888) 867-5309"
                onChangeText={this.update("phone")}
                value={this.state.phone}
                keyboardType="numeric"
              />
              <FormInput
                label="Email (Optional)"
                placeholder="you@gmail.com"
                onChangeText={this.update("email")}
                value={this.state.email}
                keyboardType="email-address"
              />
              <Button
                title="Next"
                disabled={disabled}
                activity={this.state.submitting}
                onPress={async () => {
                  this.setState({ submitting: true });
                  const {
                    phoneVerified,
                    phone
                  } = await this.props.updateUserInfo({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    phone: this.state.phone,
                    email: this.state.email
                  });

                  this.props.markOnboardingComplete();
                  if (phone && !phoneVerified) {
                    this.props.history.push("/onboarding/verify-phone");
                  } else {
                    this.props.history.push("/main", { liftoff: true });
                  }
                }}
              />
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
  nameContain: {
    flexDirection: "row"
  },
  nameInner: {
    flex: 1
  },
  leftContain: { flex: 1 },
  leftButton: {
    flex: 1,
    width: "100%",
    paddingLeft: 15,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  arrowLeft: { left: -5, width: 11, height: 17 },
  headerText: {
    fontFamily: theme.fontRegular,
    fontSize: 18,
    color: "white",
    textAlign: "center"
  },
  content: { padding: 20 },
  upperTextContain: { marginBottom: 20 },
  upperText: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 16,
    color: theme.colorDarkBlue
  },
  form: {}
});

export default compose(
  withRouter,
  connect(
    state => ({
      firstName: selectors.selectFirstName(state),
      lastName: selectors.selectLastName(state),
      email: selectors.selectEmail(state),
      phone: selectors.selectPhone(state)
    }),
    { updateUserInfo, markOnboardingComplete: actions.markOnboardingComplete }
  )
)(LinkAccount);
