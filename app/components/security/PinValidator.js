import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
  Text,
  StyleSheet
} from "react-native";
import { StatusBar, KeyboardScroll, Button } from "app/components/ui";
import { withRouter } from "react-router-native";
import { compose, connect, selectors, actions } from "app/core";
import { deleteAccount } from "app/core/actions/replaceKey";
import theme from "app/lib/theme";

const MAX_GUESSES = 5;

class PinValidator extends React.Component {
  state = {
    pinInput: "",
    pinEligible: true
  };

  guessesLeft = () => MAX_GUESSES - this.props.failedGuesses;

  validatePin = () => {
    this.setState({ pinEligible: false }, async () => {
      const result = await this.props.validatePin(this.state.pinInput);
      if (result) {
        this.props.handleValidate();
      } else {
        if (this.guessesLeft() === 0) {
          this.props.deleteAccount();
          this.props.history.push("/welcome");
        } else {
          this.setState({ pinInput: "" });
        }
      }
    });
  };

  render() {
    const validSubmission =
      this.state.pinInput.length > 0 && this.state.pinEligible;

    const guessesLeft = this.guessesLeft();

    return (
      <Modal animationType="slide" onRequestClose={this.props.onRequestClose}>
        <View style={styles.contain}>
          <StatusBar
            backgroundColor={theme.colorBlue}
            barStyle="light-content"
          />
          <View style={styles.header}>
            <View style={styles.headerOuter}>
              <TouchableOpacity onPress={this.props.onRequestClose}>
                <Image
                  style={styles.close}
                  source={require("app/assets/images/icons/close.png")}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerText}>🔒 Validate PIN</Text>
            <View style={styles.headerOuter} />
          </View>
          <KeyboardScroll>
            <View style={styles.content}>
              <TextInput
                value={this.state.pinInput}
                style={styles.pinInput}
                keyboardType="numeric"
                underlineColorAndroid="rgba(0,0,0,0)"
                placeholder="****"
                onChangeText={pinInput => {
                  this.setState({ pinInput, pinEligible: true });
                }}
                autoFocus
              />
              <Button
                title="Validate"
                disabled={!validSubmission}
                onPress={this.validatePin}
              />
              {this.props.failedGuesses > 0 && (
                <Text
                  style={[
                    styles.guessesLeft,
                    guessesLeft === 1 && styles.guessesLeftWarning
                  ]}
                >
                  {guessesLeft} guess{guessesLeft > 1 ? "es" : ""} left.
                </Text>
              )}
              {this.props.processingTriggered && (
                <Text style={styles.processingTriggered}>
                  Please enter your PIN to complete pending transfers!
                </Text>
              )}
            </View>
          </KeyboardScroll>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  contain: { flex: 1 },
  header: {
    backgroundColor: theme.colorBlue,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerOuter: {
    flex: 1
  },
  headerText: {
    flex: 3,
    fontFamily: theme.fontRegular,
    fontSize: 18,
    color: "white",
    textAlign: "center"
  },
  content: { padding: 20 },
  textContain: { marginTop: 10 },
  text: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    marginBottom: 15
  },
  pinInput: {
    fontSize: 36,
    textAlign: "center",
    paddingVertical: 30,
    ...Platform.select({
      ios: {
        fontFamily: theme.fontBodyMedium
      }
    }),
    color: theme.colorDarkBlue
  },
  bold: {
    fontFamily: theme.fontBodyBold
  },
  guessesLeft: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    marginVertical: 20,
    textAlign: "center"
  },
  guessesLeftWarning: {
    color: theme.colorRed,
    fontFamily: theme.fontBodyBold
  },
  processingTriggered: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    marginVertical: 20,
    textAlign: "center"
  }
});

export default compose(
  withRouter,
  connect(
    state => ({
      failedGuesses: selectors.selectFailedPinGuesses(state)
    }),
    { validatePin: actions.validatePin, deleteAccount }
  )
)(PinValidator);
