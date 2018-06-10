import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { SimpleHeader, StatusBar, KeyboardScroll } from "app/components/ui";
import { withRouter } from "react-router-native";
import theme from "app/lib/theme";
import TouchID from "react-native-touch-id";
import { compose, connect, selectors, actions } from "app/core";
import PinCreator from "app/components/security/PinCreator";
import PinValidator from "app/components/security/PinValidator";
import VerifyRecovery from "app/components/security/VerifyRecovery";

class TouchPin extends React.Component {
  state = {
    supportsTouchId: false,
    showPinValidator: false,
    showPinCreator: false,
    showRecovery: false,
    touchIdEnabled: this.props.touchIdEnabled,
    hasEncryptedSecretKey: this.props.hasEncryptedSecretKey
  };

  async componentWillMount() {
    const supportsTouchId = await TouchID.isSupported();
    if (supportsTouchId) {
      this.setState({ supportsTouchId: true });
    }
  }

  back = () => this.props.history.push("/main/more");
  closePinValidator = () =>
    this.setState({ showPinValidator: false, hasEncryptedSecretKey: true });
  closePinCreator = () =>
    this.setState({ showPinCreator: false, hasEncryptedSecretKey: false });

  closeRecovery = () => this.setState({ showRecovery: false });

  togglePinSetting = () => {
    if (this.props.hasEncryptedSecretKey) {
      this.setState({
        showPinValidator: true,
        hasEncryptedSecretKey: false
      });
    } else if (!this.props.backedUpKeys) {
      this.setState({ showRecovery: true });
    } else {
      this.setState({
        showPinCreator: true,
        hasEncryptedSecretKey: true
      });
    }
  };

  handleValidate = () => {
    this.setState({ showPinValidator: false, hasEncryptedSecretKey: false });
    this.props.removePinValidation();
  };

  handleCreate = () => {
    this.setState({ showPinCreator: false, hasEncryptedSecretKey: true });
  };

  render() {
    return (
      <View style={styles.contain}>
        <StatusBar />
        <SimpleHeader onLeftButtonPress={this.back} title="TouchID & PIN" />
        {this.state.showPinValidator && (
          <PinValidator
            onRequestClose={this.closePinValidator}
            handleValidate={this.handleValidate}
          />
        )}
        {this.state.showRecovery && (
          <VerifyRecovery onRequestClose={this.closeRecovery} />
        )}
        {this.state.showPinCreator && (
          <PinCreator
            onRequestClose={this.closePinCreator}
            handleCreate={this.handleCreate}
          />
        )}
        <KeyboardScroll extraHeight={100}>
          <View style={styles.touchIdContain}>
            <View style={styles.touchIdTextContain}>
              <Text style={styles.touchIdTitle}>Touch ID</Text>
              <Text style={styles.touchIdDesc}>
                Require Touch ID to open the app.
              </Text>
            </View>
            <Switch
              disabled={!this.state.supportsTouchId}
              value={this.state.touchIdEnabled}
              onValueChange={value => {
                this.setState({ touchIdEnabled: value }, async () => {
                  const touchIdEnabled = await this.props.toggleTouchId(value);
                  this.setState({ touchIdEnabled });
                });
              }}
            />
          </View>
          <View style={styles.touchIdContain}>
            <View style={styles.touchIdTextContain}>
              <Text style={styles.touchIdTitle}>PIN</Text>
              <Text style={styles.touchIdDesc}>
                A PIN encrypts your secret key on the device. Your secret key
                will be unrecoverable if you forget your PIN. 5 incorrect
                guesses will delete your account. You can restore your account
                by re-entering your secret key.
              </Text>
            </View>
            <Switch
              value={this.state.hasEncryptedSecretKey}
              onValueChange={this.togglePinSetting}
            />
          </View>
        </KeyboardScroll>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: { flex: 1 },
  touchIdContain: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLightBorder,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  touchIdTextContain: {
    flex: 1
  },
  touchIdTitle: {
    fontFamily: theme.fontBodyMedium,
    color: theme.colorDarkBlue,
    fontSize: 18
  },
  touchIdDesc: {
    fontFamily: theme.fontBodyRegular,
    color: theme.colorBodyCopy,
    marginRight: 20,
    marginTop: -5
  }
});

export default compose(
  withRouter,
  connect(
    state => ({
      touchIdEnabled: selectors.selectNeedsTouchId(state),
      hasEncryptedSecretKey: selectors.selectHasEncryptedSecretKey(state),
      backedUpKeys: selectors.selectHasBackedUpKeys(state)
    }),
    {
      toggleTouchId: actions.toggleTouchId,
      removePinValidation: actions.removePinValidation
    }
  )
)(TouchPin);
