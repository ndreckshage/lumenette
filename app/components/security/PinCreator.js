import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Text,
  StyleSheet
} from "react-native";
import { StatusBar, KeyboardScroll, Button, TextLink } from "app/components/ui";
import { withRouter } from "react-router-native";
import { compose, connect, actions } from "app/core";
import theme from "app/lib/theme";

class PinCreator extends React.Component {
  state = {
    pinInput: "",
    pinInputVerify: ""
  };

  createPin = async () => {
    await this.props.encryptWithPin(this.state.pinInput);
    this.props.handleCreate();
  };

  lockIn = () => this.setState({ lockIn: true });

  reset = () => this.setState({ lockIn: false, pinInput: "" });

  render() {
    const validSubmission = this.state.lockIn
      ? this.state.pinInput === this.state.pinInputVerify
      : this.state.pinInput.length > 0;

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
            <Text style={styles.headerText}>🔒 Add PIN</Text>
            <View style={styles.headerOuter} />
          </View>
          <KeyboardScroll>
            <View style={styles.content}>
              <TextInput
                value={
                  this.state.lockIn
                    ? this.state.pinInputVerify
                    : this.state.pinInput
                }
                style={styles.pinInput}
                keyboardType="numeric"
                placeholder="****"
                underlineColorAndroid="rgba(0,0,0,0)"
                onChangeText={pinInput => {
                  this.setState({
                    [this.state.lockIn
                      ? "pinInputVerify"
                      : "pinInput"]: pinInput
                  });
                }}
                autoFocus
              />
              <Button
                title={this.state.lockIn ? "Confirm" : "Review"}
                disabled={!validSubmission}
                onPress={this.state.lockIn ? this.createPin : this.lockIn}
              />
              {this.state.lockIn ? (
                <View style={styles.pinInfoContain}>
                  <Text style={styles.pinInfo}>Type PIN again to Confirm.</Text>
                  <TextLink onPress={this.reset} title="Reset" />
                </View>
              ) : (
                <View>
                  <Text style={styles.pinInfo}>
                    5 incorrect guesses removes your account from Lumenette. You
                    can restore your account by entering your secret key.
                  </Text>
                </View>
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
    fontSize: 24,
    color: "white",
    textAlign: "center"
  },
  content: { padding: 20, paddingTop: 0 },
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
  pinInfoContain: {
    alignItems: "center"
  },
  pinInfo: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 15,
    textAlign: "center",
    marginTop: 15,
    color: theme.colorBodyCopy
  }
});

export default compose(
  withRouter,
  connect(null, { encryptWithPin: actions.encryptWithPin })
)(PinCreator);
