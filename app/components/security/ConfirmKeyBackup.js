import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { connect, compose, selectors } from "app/core";
import { withRouter } from "react-router-native";
import { Button } from "app/components/ui";
import theme from "app/lib/theme";
import VerifyRecovery from "app/components/security/VerifyRecovery";

class ConfirmKeyBackup extends React.Component {
  state = {
    showVerifyRecovery: false
  };

  verifyRecovery = () => {
    this.setState({ showVerifyRecovery: true });
    // props.confirmKeyBackup
  };

  render() {
    return (
      <View style={styles.contain}>
        <Text style={styles.mainText}>
          Please verify your{" "}
          {this.props.mneomonic ? "recovery words" : "secret key"} (and make
          this go away)!
        </Text>
        {this.state.showVerifyRecovery && (
          <VerifyRecovery
            onRequestClose={() => {
              this.setState({ showVerifyRecovery: false });
            }}
          />
        )}
        <View style={styles.dangerContain}>
          <Button
            variation="danger"
            title="Verify"
            onPress={this.verifyRecovery}
          />
        </View>
        <View style={styles.linkWrap}>
          {this.props.dismiss && (
            <Text style={styles.linkText} onPress={this.props.dismiss}>
              Dismiss
            </Text>
          )}
          <Text
            style={styles.linkText}
            onPress={() => {
              this.props.history.push("/main/more/faqs", {
                whyWriteSk: true
              });
            }}
          >
            Learn More
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: { padding: 15, backgroundColor: theme.colorRed, borderRadius: 5 },
  mainText: {
    color: "#fff",
    fontFamily: theme.fontBodyMedium,
    textAlign: "center",
    fontSize: 18
  },
  linkWrap: { flexDirection: "row", justifyContent: "center" },
  linkText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: theme.fontBodyBold,
    textDecorationLine: "underline",
    fontSize: 18,
    paddingHorizontal: 10
  },
  dangerContain: {
    marginVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 5
  }
});

export default compose(
  withRouter,
  connect(
    state => ({
      mneomonicStr: selectors.selectMnemonicString(state)
    }),
    null
  )
)(ConfirmKeyBackup);
