import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Clipboard
} from "react-native";
import { withRouter } from "react-router-native";
import Privacy from "app/components/legal/Privacy";
import Terms from "app/components/legal/Terms";
import {
  Button,
  StatusBar,
  TextLink,
  KeyboardScroll,
  FormInput
} from "app/components/ui";
import theme from "app/lib/theme";
import { originalSuffixOf } from "app/lib/number-utils";
import { compose, connect, selectors } from "app/core";
import { updateUserInfo } from "app/core/actions/updateUserInfo";
import Toast from "react-native-root-toast";
import {
  replaceSecretKey,
  replaceSecretKeyWithMnemonic
} from "app/core/actions/replaceKey";

class RecoverAccount extends React.Component {
  state = {
    recoveryWords: new Array(24)
      .fill("")
      .reduce((acc, v, ndx) => ({ ...acc, [ndx]: v }), {}),
    recoverWithString: false,
    secretKeyOrWords: "",
    containerWidth: 0,
    showTerms: false,
    showPrivacy: false
  };

  textInputRefs = {};

  handleLayout = e => {
    this.setState({
      containerWidth: e.nativeEvent.layout.width
    });
  };

  copy = () => {
    Clipboard.setString(this.props.mnemonicStr);
    Toast.show("Copied to clipboard!", {
      position: Toast.positions.CENTER
    });
  };

  showTerms = () => this.setState({ showTerms: true });
  hideTerms = () => this.setState({ showTerms: false });

  showPrivacy = () => this.setState({ showPrivacy: true });
  hidePrivacy = () => this.setState({ showPrivacy: false });

  recoverWithString = () => this.setState({ recoverWithString: true });
  recoverWithWords = () => this.setState({ recoverWithString: false });

  replaceSecretKey = async () => {
    let success;
    if (this.state.recoverWithString) {
      if (
        this.state.secretKeyOrWords.length === 56 &&
        this.state.secretKeyOrWords.startsWith("S")
      ) {
        success = await this.props.replaceSecretKey(
          this.state.secretKeyOrWords
        );
      } else {
        success = await this.props.replaceSecretKeyWithMnemonic(
          this.state.secretKeyOrWords
        );
      }
    } else {
      success = await this.props.replaceSecretKeyWithMnemonic(
        this.recoverWordsArr()
          .map(word => word.trim())
          .join(" ")
      );
    }

    if (success) {
      this.props.history.push("/onboarding/link-account");
    }
  };

  recoverWordsArr = () =>
    Object.keys(this.state.recoveryWords).map(k => this.state.recoveryWords[k]);

  textInputRef = index => el => {
    if (el) {
      this.textInputRefs[index] = el;
    }
  };

  render() {
    const recoverWordsArr = this.recoverWordsArr();

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
          <Text style={styles.headerText}>Existing Account</Text>
          <View style={styles.leftContain} />
        </View>
        {this.state.showTerms && <Terms onRequestClose={this.hideTerms} />}
        {this.state.showPrivacy && (
          <Privacy onRequestClose={this.hidePrivacy} />
        )}
        {this.state.recoverWithString ? (
          <KeyboardScroll>
            <View style={styles.content}>
              <Text style={styles.upperText}>
                Enter your account <Text style={styles.bold}>secret key</Text>,
                or <Text style={styles.bold}>recovery words</Text> (separated by
                a space).
              </Text>
              <Text style={{ marginBottom: 10, fontSize: 16 }}>
                <TextLink onPress={this.recoverWithWords}>
                  Enter Recovery Words
                </TextLink>
              </Text>
              <FormInput
                placeholder="Secret key or recovery words..."
                onChangeText={secretKeyOrWords =>
                  this.setState({ secretKeyOrWords })
                }
                value={this.state.secretKeyOrWords}
              />
            </View>
          </KeyboardScroll>
        ) : (
          <KeyboardScroll>
            <View style={styles.content}>
              <Text style={styles.upperText}>
                Enter your account{" "}
                <Text style={styles.bold}>recovery words</Text>.
              </Text>
              <Text style={{ marginBottom: 10, fontSize: 16 }}>
                <TextLink onPress={this.recoverWithString}>
                  Enter Secret Key / Paste Recovery Words
                </TextLink>
              </Text>
              <View style={{ marginBottom: 10 }}>
                {recoverWordsArr.map((recoveryWord, index) => (
                  <View
                    key={index}
                    style={[
                      styles.wordCheckContain,
                      index < recoverWordsArr.length && {
                        borderBottomWidth: 0
                      }
                    ]}
                  >
                    <Text style={styles.wordCheckIndex}>{index + 1}.</Text>
                    <TextInput
                      ref={this.textInputRef(index)}
                      value={recoveryWord}
                      style={[styles.wordInput]}
                      underlineColorAndroid="rgba(0,0,0,0)"
                      placeholder={`${originalSuffixOf(
                        index + 1
                      )} recovery word`}
                      autoCapitalize="none"
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        const nextRef = this.textInputRefs[index + 1];
                        if (nextRef) {
                          nextRef.focus();
                        }
                      }}
                      onChangeText={txt => {
                        this.setState(state => ({
                          ...state,
                          recoveryWords: {
                            ...state.recoveryWords,
                            [index]: txt
                          }
                        }));
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
          </KeyboardScroll>
        )}
        <View onLayout={this.handleLayout} style={styles.form}>
          <Image
            source={require("app/assets/images/white-text-grad.png")}
            resizeMode="stretch"
            style={[
              {
                position: "absolute",
                bottom: 0,
                top: -50,
                width: this.state.containerWidth
              }
            ]}
          />
          <Button title="Next" onPress={this.replaceSecretKey} />
          <Text style={styles.termsPrivacy}>
            By pressing next, you agree to our{" "}
            <TextLink onPress={this.showTerms}>Terms</TextLink> and that you
            have read our{" "}
            <TextLink onPress={this.showPrivacy}>Privacy Policy</TextLink>.
          </Text>
        </View>
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
  leftContain: { flex: 1 },
  leftButton: {
    flex: 1,
    width: "100%",
    paddingLeft: 15,
    alignItems: "flex-start",
    justifyContent: "center"
  },
  wordCheckContain: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: theme.colorLightBorder,
    borderBottomWidth: 1
  },
  wordCheckIndex: {
    fontSize: 16,
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue,
    marginRight: 8
  },
  wordInput: {
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue,
    flex: 1,
    padding: 0,
    margin: 0
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
    { updateUserInfo, replaceSecretKey, replaceSecretKeyWithMnemonic }
  )
)(RecoverAccount);
