import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet
} from "react-native";
import { ExpandableKey, TextLink, StatusBar } from "app/components/ui";
import PinValidator from "app/components/security/PinValidator";
import ViewRecoveryWords from "app/components/security/ViewRecoveryWords";
import { connect, selectors } from "app/core";
import theme from "app/lib/theme";

const RecoveryWordsModal = props => (
  <Modal animationType="slide" onRequestClose={props.onRequestClose}>
    <View style={rStyles.contain}>
      <StatusBar backgroundColor={theme.colorBlue} barStyle="light-content" />
      <View style={rStyles.header}>
        <View style={rStyles.headerOuter}>
          <TouchableOpacity onPress={props.onRequestClose}>
            <Image source={require("app/assets/images/icons/close.png")} />
          </TouchableOpacity>
        </View>
        <Text style={rStyles.headerText}>
          {props.mneomonicStr ? "Recovery Words" : "Secret Key"}
        </Text>
        <View style={rStyles.headerOuter} />
      </View>
      <ViewRecoveryWords />
    </View>
  </Modal>
);

const rStyles = StyleSheet.create({
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
  content: { padding: 20 }
});

class KeyRevealer extends React.Component {
  state = {
    showPinValidator: false,
    showRecoveryWordsModal: false
  };

  handleExpandEncrypted = () => this.setState({ showPinValidator: true });
  closePinValidator = () => this.setState({ showPinValidator: false });

  openRecoveryModal = () => {
    if (this.props.secretKey) {
      this.setState({ showRecoveryWordsModal: true });
    } else {
      this.handleExpandEncrypted();
    }
  };

  handleValidate = () => {
    this.closePinValidator();
    this.openRecoveryModal();
  };

  closeRecoveryModal = () => this.setState({ showRecoveryWordsModal: false });

  render() {
    return (
      <View>
        <Text style={{ fontSize: 16, marginBottom: 15 }}>
          <TextLink onPress={this.openRecoveryModal}>
            {this.props.mneomonicStr ? "View Recovery Words / " : ""}Secret Key
          </TextLink>
        </Text>
        <ExpandableKey
          title="Public Key:"
          keyStr={this.props.publicKey}
          expanded
        />
        {this.state.showRecoveryWordsModal && (
          <RecoveryWordsModal
            mneomonicStr={this.props.mneomonicStr}
            onRequestClose={this.closeRecoveryModal}
          />
        )}
        {this.state.showPinValidator && (
          <PinValidator
            handleValidate={this.handleValidate}
            onRequestClose={this.closePinValidator}
          />
        )}
      </View>
    );
  }
}

export default connect(state => ({
  publicKey: selectors.selectPublicKey(state),
  secretKey: selectors.selectSecretKey(state),
  mneomonicStr: selectors.selectMnemonicString(state)
}))(KeyRevealer);
