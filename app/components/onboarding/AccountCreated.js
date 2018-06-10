import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { withRouter } from "react-router-native";
import Privacy from "app/components/legal/Privacy";
import Terms from "app/components/legal/Terms";
import FAQs from "app/components/legal/FAQs";
import { Button, StatusBar, TextLink } from "app/components/ui";
import theme from "app/lib/theme";
import { compose, connect, selectors } from "app/core";
import { updateUserInfo } from "app/core/actions/updateUserInfo";
import ViewRecoveryWords from "app/components/security/ViewRecoveryWords";

class AccountCreated extends React.Component {
  state = {
    secretKey: "",
    containerWidth: 0,
    showTerms: false,
    showPrivacy: false,
    showFAQs: false
  };

  handleLayout = e => {
    this.setState({
      containerWidth: e.nativeEvent.layout.width
    });
  };

  showTerms = () => this.setState({ showTerms: true });
  hideTerms = () => this.setState({ showTerms: false });

  showPrivacy = () => this.setState({ showPrivacy: true });
  hidePrivacy = () => this.setState({ showPrivacy: false });

  showFAQs = () => this.setState({ showFAQs: true });
  hideFAQs = () => this.setState({ showFAQs: false });

  update = k => v => this.setState({ [k]: v });

  render() {
    return (
      <View style={styles.contain}>
        <StatusBar backgroundColor={theme.colorBlue} barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.leftContain}>
            <TouchableOpacity
              onPress={() => this.props.history.push("/welcome")}
              style={styles.leftButton}
            >
              <Image
                style={styles.arrowLeft}
                source={require("app/assets/images/icons/arrow-left-white.png")}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerText}>Welcome!</Text>
          <View style={styles.leftContain} />
        </View>
        {this.state.showTerms && <Terms onRequestClose={this.hideTerms} />}
        {this.state.showPrivacy && (
          <Privacy onRequestClose={this.hidePrivacy} />
        )}
        {this.state.showFAQs && <FAQs onRequestClose={this.hideFAQs} />}
        <ViewRecoveryWords
          topNode={showKeys =>
            !showKeys && (
              <Text
                style={[
                  styles.upperText,
                  {
                    backgroundColor: theme.colorSectionDivider,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    fontSize: 15,
                    fontFamily: theme.fontBodyMedium
                  }
                ]}
              >
                Questions about Stellar Lumen or Lumenette before getting
                started? <TextLink onPress={this.showFAQs}>Learn More</TextLink>.
              </Text>
            )
          }
          extraLink={
            <TextLink to="/onboarding/recover-account">
              Existing Account?
            </TextLink>
          }
        />
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
          <Button
            title="Next"
            onPress={async () => {
              this.props.history.push("/onboarding/link-account");
            }}
          />
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
    { updateUserInfo }
  )
)(AccountCreated);
