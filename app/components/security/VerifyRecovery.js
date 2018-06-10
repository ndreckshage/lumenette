import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  StyleSheet
} from "react-native";
import {
  StatusBar,
  KeyboardScroll,
  Button,
  TextLink,
  FormInput
} from "app/components/ui";
import { withRouter } from "react-router-native";
import { compose, connect, selectors, actions } from "app/core";
import { originalSuffixOf } from "app/lib/number-utils";
import theme from "app/lib/theme";

const getRandom = ln => Math.ceil(Math.random() * ln);

const randomizeWordRequest = ln => {
  if (ln < 2) {
    return [null, null];
  }

  const wordA = getRandom(ln);
  let wordB = getRandom(ln);
  while (wordA === wordB) {
    wordB = getRandom(ln);
  }

  return wordA > wordB ? [wordB, wordA] : [wordA, wordB];
};

class VerifyRecovery extends React.Component {
  state = {
    enterSkOrAllWords: !this.props.mnemonicString,
    wordIndexes: randomizeWordRequest(this.props.mnemonic.length),
    skOrAllWords: "",
    wordA: "",
    wordB: ""
  };

  confirmKeyBackup = () => {
    if (this.valid()) {
      this.props.confirmKeyBackup();
      this.props.onRequestClose();
    }
  };

  valid = () => {
    const skOrAllWords = this.state.skOrAllWords.trim();

    return this.state.enterSkOrAllWords
      ? skOrAllWords &&
          (skOrAllWords === this.props.mnemonicString ||
            skOrAllWords === this.props.secretKey)
      : this.state.wordA.trim() ===
          this.props.mnemonic[this.state.wordIndexes[0] - 1] &&
          this.state.wordB.trim() ===
            this.props.mnemonic[this.state.wordIndexes[1] - 1];
  };

  enterSecretOrRecovery = () => this.setState({ enterSkOrAllWords: true });
  enterRecovery = () => this.setState({ enterSkOrAllWords: false });

  viewKeys = () => {
    this.props.onRequestClose();
    this.props.history.push("/main/more/account", { scrollToKeys: true });
  };

  render() {
    const recoveryWord = (word, index) => {
      return (
        <View
          style={[
            styles.wordCheckContain,
            index === 1 && { borderBottomWidth: 0 }
          ]}
        >
          <Text style={styles.wordCheckIndex}>
            {this.state.wordIndexes[index]}.
          </Text>
          <TextInput
            value={this.state[word]}
            style={[styles.wordInput]}
            underlineColorAndroid="rgba(0,0,0,0)"
            placeholder={`${originalSuffixOf(
              this.state.wordIndexes[index]
            )} recovery word`}
            autoCapitalize="none"
            onChangeText={txt => {
              this.setState({ [word]: txt });
            }}
            autoFocus={index === 0}
          />
        </View>
      );
    };

    const valid = this.valid();

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
            <Text style={styles.headerText}>
              Verify{" "}
              {this.props.mnemonicString ? "Recovery Words" : "Secret Key"}
            </Text>
            <View style={styles.headerOuter} />
          </View>
          <KeyboardScroll>
            <View style={styles.content}>
              {this.state.enterSkOrAllWords ? (
                <View>
                  {this.props.mnemonicString ? (
                    <Text style={styles.upperText}>
                      Enter your account{" "}
                      <Text style={styles.bold}>secret key</Text>, or{" "}
                      <Text style={styles.bold}>recovery words</Text> (separated
                      by a space).
                    </Text>
                  ) : (
                    <Text style={styles.upperText}>
                      Enter your account{" "}
                      <Text style={styles.bold}>secret key</Text>.
                    </Text>
                  )}
                  {this.props.mnemonicString ? (
                    <Text style={{ marginBottom: 10, fontSize: 16 }}>
                      <TextLink onPress={this.enterRecovery}>
                        Enter Recovery Words
                      </TextLink>
                    </Text>
                  ) : null}
                  <Text style={{ marginBottom: 10, fontSize: 16 }}>
                    <TextLink onPress={this.viewKeys}>View Keys</TextLink>
                  </Text>
                  <FormInput
                    placeholder={`Secret key${
                      this.props.mnemonicString ? " or recovery words..." : ""
                    }`}
                    onChangeText={skOrAllWords =>
                      this.setState({ skOrAllWords })
                    }
                    value={this.state.skOrAllWords}
                  />
                </View>
              ) : (
                <View>
                  <Text style={styles.upperText}>
                    Verify <Text style={styles.bold}>recovery words</Text>.
                    Please enter your{" "}
                    {originalSuffixOf(this.state.wordIndexes[0])} and{" "}
                    {originalSuffixOf(this.state.wordIndexes[1])} words.
                  </Text>
                  <Text style={{ marginBottom: 10, fontSize: 16 }}>
                    <TextLink onPress={this.enterSecretOrRecovery}>
                      Enter Secret Key / All Recovery Words
                    </TextLink>
                  </Text>
                  <Text style={{ marginBottom: 10, fontSize: 16 }}>
                    <TextLink onPress={this.viewKeys}>
                      View Recovery Words
                    </TextLink>
                  </Text>
                  <View style={{ marginBottom: 10 }}>
                    {recoveryWord("wordA", 0)}
                    {recoveryWord("wordB", 1)}
                  </View>
                </View>
              )}
              <Button
                title="Verify"
                disabled={!valid}
                onPress={this.confirmKeyBackup}
              />
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
  upperText: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    marginBottom: 10,
    color: theme.colorDarkBlue
  },
  bold: {
    fontFamily: theme.fontBodyBold
  }
});

export default compose(
  withRouter,
  connect(
    state => ({
      failedGuesses: selectors.selectFailedPinGuesses(state),
      mnemonic: selectors.selectMnemonic(state),
      mnemonicString: selectors.selectMnemonicString(state),
      secretKey: selectors.selectSecretKey(state)
    }),
    {
      confirmKeyBackup: actions.confirmKeyBackup
    }
  )
)(VerifyRecovery);
