import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  InteractionManager,
  Keyboard,
  Text
} from "react-native";
import { SimpleHeader, StatusBar, FormInput, Button } from "app/components/ui";
import * as patterns from "app/lib/regex";
import normalizePhone from "app/core/lib/normalizePhone";
import DeleteModal from "app/components/security/DeleteModal";
import KeyRevealer from "app/components/security/KeyRevealer";
import ConfirmKeyBackup from "app/components/security/ConfirmKeyBackup";
import { connect, compose, selectors, actions } from "app/core";
import { updateUserInfo } from "app/core/actions/updateUserInfo";
import { KeyboardScroll, ExpandableKey, TextLink } from "app/components/ui";
import { withRouter } from "react-router-native";
import theme from "app/lib/theme";

class FederationAddresses_ extends React.Component {
  state = { expanded: false };
  render() {
    return (
      <View>
        <Text style={fStyles.header}>Federation Addresses</Text>
        <Text style={fStyles.info}>
          Users of other wallets can find your Lumenette public key based on
          these addresses.
        </Text>
        {this.state.expanded ? (
          this.props.federationAddresses.filter(Boolean).map(address => (
            <View key={address}>
              <ExpandableKey expanded keyStr={`${address}*lumenette.com`} />
            </View>
          ))
        ) : (
          <Text style={fStyles.link}>
            <TextLink
              onPress={() => {
                this.setState({ expanded: true });
              }}
            >
              Display Federation Addresses
            </TextLink>
          </Text>
        )}
      </View>
    );
  }
}

const fStyles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue,
    marginBottom: 5
  },
  info: {
    fontSize: 16,
    fontFamily: theme.fontBodyRegular,
    color: theme.colorBodyCopy,
    marginBottom: 5
  },
  link: {
    fontSize: 16
  }
});

const FederationAddresses = connect(state => ({
  federationAddresses: selectors.selectFederationAddresses(state)
}))(FederationAddresses_);

class Account extends React.Component {
  state = {
    phone: this.props.phone,
    email: this.props.email,
    userName: this.props.userName,
    refreshing: false,
    verifyingPhone: false,
    verifyingEmail: false,
    savingForm: false,
    showDeleteModal: false,
    phoneCode: "",
    emailCode: ""
  };

  componentDidMount() {
    this.props.loadMyKeypairLinks();
    if (
      this.props.history.location.state &&
      this.props.history.location.state.scrollToKeys
    ) {
      InteractionManager.runAfterInteractions(() => {
        if (this.scroller && this.accountDividerY) {
          this.scroller.scrollToPosition(0, this.accountDividerY);
        }
      });
    }
  }

  scroller = null;
  accountDividerY = 0;

  handleRefresh = () => {
    this.setState({ refreshing: true });
    this.props.loadMyKeypairLinks().then(() => {
      this.setState({ refreshing: false });
    });
  };

  update = k => v => this.setState({ [k]: v });
  back = () => this.props.history.push("/main/more");
  resendVerification = linkType => () =>
    this.props.resendVerification(linkType);

  verifyPhone = () => {
    this.setState({ verifyingPhone: true });
    this.props.verifyPhoneNumber(this.state.phoneCode).then(() => {
      this.setState({ verifyingPhone: false });
    });
  };

  verifyEmail = () => {
    this.setState({ verifyingEmail: true });
    this.props.verifyEmailAddress(this.state.emailCode).then(() => {
      this.setState({ verifyingEmail: false });
    });
  };

  updateUserInfo = () => {
    this.setState({ savingForm: true });
    Keyboard.dismiss();
    this.props
      .updateUserInfo({
        phone: this.state.phone,
        email: this.state.email,
        userName: this.state.userName
      })
      .then(data => {
        this.setState({
          savingForm: false,
          phone: data.phone,
          email: data.email,
          userName: data.userName
        });
      });
  };

  pending = linkType => (
    <View style={styles.pendingContain}>
      <Text style={styles.pending}>PENDING</Text>
      <TouchableOpacity onPress={this.resendVerification(linkType)}>
        <Text style={styles.pendingResendContain}>
          (<Text style={styles.pendingResend}>Resend</Text>)
        </Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const verified = <Text style={styles.verified}>VERIFIED</Text>;
    const pendingEmail = this.pending("email");
    const pendingPhone = this.pending("phone");

    const noChanges =
      this.state.email === this.props.email &&
      this.state.phone === this.props.phone &&
      this.state.userName === this.props.userName;

    const phoneValid = !this.state.phone || normalizePhone(this.state.phone);
    const emailVaild =
      !this.state.email || this.state.email.match(patterns.email);

    const disabled = noChanges || !phoneValid || !emailVaild;

    const phoneCodeDisabled = this.state.phoneCode.length !== 4;
    const emailCodeDisabled = this.state.emailCode.length !== 6;

    return (
      <View style={styles.container}>
        <StatusBar />
        <SimpleHeader title="Account" onLeftButtonPress={this.back} />
        <KeyboardScroll
          kbRef={scroller => (this.scroller = scroller)}
          extraHeight={100}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
              tintColor={theme.colorBlue}
            />
          }
        >
          <View style={styles.content}>
            <View style={styles.form}>
              <FormInput
                label="First Name"
                value={this.props.firstName}
                autoCapitalize="words"
                editable={false}
              />
              <FormInput
                label="Last Name"
                value={this.props.lastName}
                onChangeText={this.update("lastName")}
                autoCapitalize="words"
                editable={false}
              />
              <FormInput
                label="Phone Number"
                placeholder="(888) 867-5309"
                rightText={
                  this.state.phone && this.state.phone === this.props.phone
                    ? this.props.phoneVerified ? verified : pendingPhone
                    : null
                }
                keyboardType="numeric"
                value={this.state.phone}
                onChangeText={this.update("phone")}
              />
              {this.state.phone &&
              this.state.phone === this.props.phone &&
              !this.props.phoneVerified ? (
                <FormInput
                  label="Phone Confirmation Code"
                  placeholder="####"
                  onChangeText={this.update("phoneCode")}
                  value={this.state.phoneCode}
                  keyboardType="numeric"
                  rowButton={
                    <Button
                      title="Verify"
                      disabled={phoneCodeDisabled}
                      activity={this.state.verifyingPhone}
                      onPress={this.verifyPhone}
                    />
                  }
                />
              ) : null}
              <FormInput
                label="Email"
                placeholder="you@gmail.com"
                value={this.state.email}
                rightText={
                  this.state.email && this.state.email === this.props.email
                    ? this.props.emailVerified ? verified : pendingEmail
                    : null
                }
                onChangeText={this.update("email")}
              />
              {this.state.email &&
              this.state.email === this.props.email &&
              !this.props.emailVerified ? (
                <FormInput
                  label="Email Confirmation Code"
                  placeholder="######"
                  onChangeText={this.update("emailCode")}
                  value={this.state.emailCode}
                  keyboardType="numeric"
                  rowButton={
                    <Button
                      title="Verify"
                      disabled={emailCodeDisabled}
                      activity={this.state.verifyingEmail}
                      onPress={this.verifyEmail}
                    />
                  }
                />
              ) : null}
              <FormInput
                label="User Name"
                value={this.state.userName}
                onChangeText={this.update("userName")}
                placeholder="Optional"
                autoCapitalize="none"
              />
              <Button
                title="Save"
                disabled={disabled}
                activity={this.state.savingForm}
                onPress={this.updateUserInfo}
              />
            </View>
            <View
              style={styles.divider}
              onLayout={e => {
                this.accountDividerY = e.nativeEvent.layout.y;
              }}
            />
            {!this.props.hasBackedUpKeys && (
              <View style={styles.confirmBackup}>
                <ConfirmKeyBackup />
              </View>
            )}
            <KeyRevealer />
            <View style={styles.divider} />
            {this.props.hasFederationAddress && [
              <FederationAddresses key="1" />,
              <View key="2" style={styles.divider} />
            ]}
            <View style={styles.dangerButtonContain}>
              {this.state.showDeleteModal && (
                <DeleteModal
                  onRequestClose={() => {
                    this.setState({ showDeleteModal: false });
                  }}
                />
              )}
              <Button
                title="Remove from Lumenette"
                variation="danger"
                onPress={() => {
                  this.setState({ showDeleteModal: true });
                }}
              />
            </View>
          </View>
        </KeyboardScroll>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  divider: {
    marginVertical: 40,
    height: 1,
    backgroundColor: theme.colorLightBorder
  },
  dangerButtonContain: {
    marginTop: 20
  },
  verified: {
    fontFamily: theme.fontRegular,
    fontSize: 14,
    color: theme.colorGreen
  },
  pendingContain: {
    flexDirection: "row",
    alignItems: "center"
  },
  pendingResendContain: {
    fontSize: 14,
    color: theme.colorDarkBlue,
    fontFamily: theme.fontBodyRegular
  },
  pendingResend: {
    textDecorationLine: "underline"
  },
  pending: {
    marginRight: 4,
    fontFamily: theme.fontRegular,
    fontSize: 14,
    color: theme.colorRed
  },
  confirmBackup: {
    marginBottom: 20
  }
});

export default compose(
  withRouter,
  connect(
    state => ({
      email: selectors.selectEmail(state),
      emailVerified: selectors.selectEmailVerified(state),
      phone: selectors.selectPhone(state),
      phoneVerified: selectors.selectPhoneVerified(state),
      userName: selectors.selectUserName(state),
      firstName: selectors.selectFirstName(state),
      lastName: selectors.selectLastName(state),
      hasBackedUpKeys: selectors.selectHasBackedUpKeys(state),
      hasFederationAddress: selectors.selectHasFederationAddress(state)
    }),
    {
      loadMyKeypairLinks: actions.loadMyKeypairLinks,
      resendVerification: actions.resendVerification,
      verifyPhoneNumber: actions.verifyPhoneNumber,
      verifyEmailAddress: actions.verifyEmailAddress,
      updateUserInfo
    }
  )
)(Account);
