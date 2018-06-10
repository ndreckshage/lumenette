import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
  TextInput,
  Text,
  StyleSheet
} from "react-native";
import { StatusBar, KeyboardScroll, Button, TextLink } from "app/components/ui";
import { withRouter } from "react-router-native";
import { compose, connect, selectors, actions } from "app/core";
import theme from "app/lib/theme";

class BetaValidator extends React.Component {
  state = {
    betaCode: ""
  };

  enterBeta = () => {
    if (this.state.betaCode.trim() === this.props.betaCode) {
      this.props.grantBetaAccess();
      this.props.markIntroComplete();
      this.props.history.push("/onboarding/account-created");
    }
  };

  render() {
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
            <Text style={styles.headerText}>Beta Invite</Text>
            <View style={styles.headerOuter} />
          </View>
          <KeyboardScroll>
            <View style={styles.content}>
              <TextInput
                value={this.state.pinInput}
                style={styles.pinInput}
                placeholder="Enter Beta Access Code"
                autoCapitalize="none"
                underlineColorAndroid="rgba(0,0,0,0)"
                onChangeText={betaCode => {
                  this.setState({ betaCode });
                }}
                autoFocus
              />
              <Button title="Launch! 🚀" onPress={this.enterBeta} />
              <Text style={styles.processingTriggered}>
                Get Lumenette Beta Access on
              </Text>
              <Text style={[styles.processingTriggered, { marginTop: 10 }]}>
                <TextLink
                  onPress={() => {
                    Linking.openURL(this.props.betaLink);
                  }}
                >
                  {this.props.betaLinkTitle}
                </TextLink>
              </Text>
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
  content: { padding: 20 },
  textContain: { marginTop: 10 },
  text: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    marginBottom: 15
  },
  pinInput: {
    fontSize: 24,
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
  processingTriggered: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    marginTop: 20,
    textAlign: "center"
  }
});

export default compose(
  withRouter,
  connect(
    state => ({
      betaCode: selectors.selectBetaCode(state),
      betaLinkTitle: selectors.selectBetaLinkTitle(state),
      betaLink: selectors.selectBetaLink(state)
    }),
    {
      grantBetaAccess: actions.grantBetaAccess,
      markIntroComplete: actions.markIntroComplete
    }
  )
)(BetaValidator);
