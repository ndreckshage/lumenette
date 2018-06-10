import React from "react";
import {
  View,
  Text,
  Picker,
  TouchableOpacity,
  Linking,
  Image,
  SectionList,
  StyleSheet
} from "react-native";
import currencies from "app/lib/currencies";
import Terms from "app/components/legal/Terms";
import Privacy from "app/components/legal/Privacy";
import { withRouter } from "react-router-native";
import { StatusBar, SimpleHeader } from "app/components/ui";
import { connect, selectors, actions } from "app/core";
import theme from "app/lib/theme";
import DeviceInfo from "react-native-device-info";

const version = DeviceInfo.getVersion();
const buildNumber = DeviceInfo.getBuildNumber();

const Section = props => (
  <View style={sectionStyles.contain}>
    <View style={sectionStyles.headerContain}>
      <Text style={sectionStyles.title}>{props.title}</Text>
    </View>
  </View>
);

const sectionStyles = StyleSheet.create({
  contain: {
    backgroundColor: theme.colorSectionDivider
  },
  headerContain: { paddingLeft: 10 },
  title: {
    fontFamily: theme.fontRegular,
    fontSize: 16,
    paddingVertical: 10,
    color: theme.colorDarkBlue
  }
});

class Item_ extends React.Component {
  state = { open: false };
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            if (this.props.to) {
              this.props.history.push(this.props.to);
            } else if (this.props.onPress) {
              this.props.onPress();
            } else if (this.props.children) {
              this.setState({ open: !this.state.open });
            }
          }}
          style={[
            itemStyles.contain,
            this.props.last && itemStyles.containLast
          ]}
        >
          <Text style={itemStyles.text}>{this.props.title}</Text>
          <View style={itemStyles.right}>
            {this.props.rightText && (
              <Text style={itemStyles.rightText}>{this.props.rightText}</Text>
            )}
            <Image
              style={
                this.props.children
                  ? { width: 24, height: 15 }
                  : { width: 15, height: 24 }
              }
              source={
                !this.props.children
                  ? require("app/assets/images/icons/arrow-right.png")
                  : this.state.open
                    ? require("app/assets/images/icons/arrow-up.png")
                    : require("app/assets/images/icons/arrow-down.png")
              }
            />
          </View>
        </TouchableOpacity>
        {this.state.open && this.props.children}
      </View>
    );
  }
}

const Item = withRouter(Item_);

const itemStyles = StyleSheet.create({
  contain: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#EAEAEA",
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  containLast: {
    borderBottomWidth: 1
  },
  text: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue
  },
  right: {
    flexDirection: "row",
    alignItems: "center"
  },
  rightText: {
    fontFamily: theme.fontBodyMedium,
    fontSize: 15,
    color: theme.colorDarkBlue,
    marginRight: 10
  }
});

class More extends React.Component {
  state = {
    showTerms: false,
    showPrivacy: false
  };

  showTerms = () => this.setState({ showTerms: true });
  hideTerms = () => this.setState({ showTerms: false });

  showPrivacy = () => this.setState({ showPrivacy: true });
  hidePrivacy = () => this.setState({ showPrivacy: false });

  render() {
    return (
      <View style={styles.contain}>
        <StatusBar />
        <SimpleHeader title="Account & Information" />
        {this.state.showTerms && <Terms onRequestClose={this.hideTerms} />}
        {this.state.showPrivacy && (
          <Privacy onRequestClose={this.hidePrivacy} />
        )}

        <SectionList
          stickySectionHeadersEnabled
          renderSectionHeader={({ section }) => (
            <Section title={section.title} />
          )}
          ItemSeparatorComponent={() => <View style={styles.seperator} />}
          renderItem={({ item }) => item}
          sections={[
            {
              title: "Account",
              data: [
                <Item key="1" title="Account" to="/main/more/account" />,
                <Item
                  key="2"
                  title="Touch ID & PIN"
                  to="/main/more/touchpin"
                />,
                <Item
                  key="3"
                  title="Saved Wallets"
                  to="/main/more/favorites"
                />,
                <Item
                  key="4"
                  title="Preferred Currency"
                  rightText={this.props.preferredCurrency}
                  last
                >
                  <Picker
                    selectedValue={this.props.preferredCurrency}
                    onValueChange={this.props.updateCurrency}
                  >
                    {currencies.map(currency => (
                      <Picker.Item
                        key={currency}
                        label={currency}
                        value={currency}
                      />
                    ))}
                  </Picker>
                </Item>
              ]
            },
            {
              title: "Information / FAQs",
              data: [
                <Item
                  key="0"
                  title="Frequently Asked Questions"
                  to="/main/more/faqs"
                />,
                <Item
                  key="1"
                  title="Deposit / Withdraw"
                  to="/main/more/deposit-withdraw"
                />,
                <Item
                  key="2"
                  title="Learn About Stellar"
                  to="/main/more/learn-about-stellar"
                />,
                <Item
                  key="3"
                  title="How Lumenette Works"
                  to="/main/more/learn-about-lumenette"
                />,
                <Item key="4" title="Show Welcome Slides" to="/welcome" />,
                <Item
                  key="5"
                  title="Minimum Account Balance"
                  to="/main/more/minimum-account-balance"
                />,
                <Item key="6" title="Security" to="/main/more/security" />,
                <Item key="7" title="Fees" to="/main/more/fees" />,
                <Item
                  key="8"
                  title="Contact (team@lumenette.com)"
                  onPress={() => {
                    Linking.openURL("mailto:team@lumenette.com");
                  }}
                  last
                />
              ]
            },
            {
              title: "Legal",
              data: [
                <Item
                  key="1"
                  title="Terms and Conditions"
                  onPress={this.showTerms}
                />,
                <Item
                  key="2"
                  title="Privacy Policy"
                  onPress={this.showPrivacy}
                />
              ]
            }
          ]}
          ListFooterComponent={
            <View style={styles.versionInfoContain}>
              <Text style={styles.versionInfo}>
                Version {version} (Build {buildNumber})
              </Text>
            </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: {
    flex: 1
  },
  versionInfoContain: {
    padding: 20,
    backgroundColor: theme.colorSectionDivider
  },
  versionInfo: {
    fontFamily: theme.fontRegular,
    fontSize: 15,
    flex: 1,
    textAlign: "center",
    color: theme.colorDarkBlue
  }
});

export default connect(
  state => ({
    preferredCurrency: selectors.selectPreferredCurrency(state)
  }),
  { updateCurrency: actions.updateCurrency }
)(More);
