import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard
} from "react-native";
import { withRouter } from "react-router-native";
import { ExpandableKey, KeyboardScroll, TextLink } from "app/components/ui";
import theme from "app/lib/theme";
import { compose, connect, selectors } from "app/core";
import { updateUserInfo } from "app/core/actions/updateUserInfo";
import { replaceSecretKey } from "app/core/actions/replaceKey";
import Toast from "react-native-root-toast";

class ViewRecoveryWords extends React.Component {
  state = {
    showKeys: !this.props.mnemonicStr
  };

  showKeys = () => this.setState({ showKeys: !this.state.showKeys });
  copy = () => {
    Clipboard.setString(this.props.mnemonicStr);
    Toast.show("Copied to clipboard!", {
      position: Toast.positions.CENTER
    });
  };

  render() {
    return (
      <KeyboardScroll>
        <View style={styles.content}>
          <View style={styles.upperTextContain}>
            {this.props.topNode && this.props.topNode(this.state.showKeys)}
            {this.state.showKeys ? (
              this.props.mnemonicStr ? (
                <Text style={styles.upperText}>
                  Your <Text style={styles.bold}>secret key</Text> is generated
                  by your recovery words. You can write down either your
                  recovery words, your secret key, or both.
                </Text>
              ) : (
                <Text style={styles.upperText}>
                  Write down your <Text style={styles.bold}>secret key</Text> to
                  ensure you don&apos;t lose access to your account!
                </Text>
              )
            ) : (
              <Text style={styles.upperText}>
                These are your 24 account{" "}
                <Text style={styles.bold}>recovery words</Text>. Write them down
                now or later!
              </Text>
            )}
          </View>
          <View>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              {this.props.extraLink}
              {this.props.extraLink && this.props.mnemonicStr ? "  " : null}
              {this.props.mnemonicStr && (
                <TextLink onPress={this.showKeys}>
                  {this.state.showKeys
                    ? "View Recovery Words"
                    : "View Secret Key"}
                </TextLink>
              )}
            </Text>
          </View>
          {this.state.showKeys ? (
            <View>
              <ExpandableKey
                title="Secret Key:"
                keyStr={this.props.secretKey}
                expanded
              />
            </View>
          ) : (
            <View>
              {this.props.mnemonic.map((word, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    borderBottomColor: theme.colorLightBorder,
                    borderBottomWidth:
                      this.props.mnemonic.length - 1 !== index ? 1 : 0
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: theme.fontBodyRegular,
                      color: theme.colorDarkBlue,
                      marginRight: 8
                    }}
                  >
                    {index + 1}.
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: theme.fontBodyBold,
                      color: theme.colorDarkBlue
                    }}
                  >
                    {word}
                  </Text>
                </View>
              ))}
              <TouchableOpacity onPress={this.copy}>
                <Text
                  style={{
                    textAlign: "right",
                    fontFamily: theme.fontRegular,
                    fontSize: 16,
                    paddingVertical: 10,
                    color: theme.colorDarkBlue
                  }}
                >
                  Copy
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardScroll>
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
  content: { padding: 20, paddingBottom: 200 },
  upperText: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    marginBottom: 10,
    color: theme.colorDarkBlue
  },
  bold: {
    fontFamily: theme.fontBodyBold
  },
  form: {
    padding: 20,
    paddingTop: 0
  },
  secretKeyLink: {
    marginBottom: 20,
    fontSize: 16
  },
  termsPrivacy: {
    marginTop: 20,
    fontFamily: theme.fontBodyRegular,
    fontSize: 16,
    color: theme.colorBodyCopy
  }
});

export default compose(
  withRouter,
  connect(
    state => ({
      mnemonicStr: selectors.selectMnemonicString(state),
      mnemonic: selectors.selectMnemonic(state),
      publicKey: selectors.selectPublicKey(state),
      secretKey: selectors.selectSecretKey(state)
    }),
    { updateUserInfo, replaceSecretKey }
  )
)(ViewRecoveryWords);
