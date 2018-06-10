import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ExpandableKey, TextLink} from 'app/components/ui';
import theme from 'app/lib/theme';

const UserInfo = props => {
  const contact = props.contact
    ? props.contact
    : {
        type: props.filterMatchType,
        displayValue: props.contactsFilter,
        value: props.normalizedContactsFilter,
        name: ''
      };

  const isXlmAddressEntry = props.filterMatchType === 'lumen';
  const publicKey = (() => {
    if (props.matchedLumenAddress) {
      return props.matchedLumenAddress;
    }

    if (isXlmAddressEntry) {
      return props.normalizedContactsFilter;
    }

    return null;
  })();

  const isMatch = !!publicKey;

  const newContactNameStr = contact.name ? `${contact.name} at ` : '';
  const matchContactName = contact.name
    ? `${contact.name} (${contact.value})`
    : contact.value;
  const matchContactNameStr =
    props.filterMatchType === 'lumen'
      ? `${props.contactsFilter} is`
      : `${matchContactName} has`;

  return (
    <View style={userInfoStyles.userInfoContain}>
      <View style={userInfoStyles.userInfoTitle}>
        <View style={userInfoStyles.userInfoLine} />
        <Text style={userInfoStyles.userInfoTitleText}>
          {isMatch ? 'MATCH' : 'NEW USER'}
        </Text>
        <View style={userInfoStyles.userInfoLine} />
      </View>
      {isMatch ? (
        <View>
          <Text
            style={[
              userInfoStyles.userInfoText,
              userInfoStyles.textMarginBottom
            ]}
          >
            {matchContactNameStr} a lumen address. Payment will process
            immediately.
          </Text>
          <ExpandableKey title="Address:" keyStr={publicKey} copy={false} />
        </View>
      ) : (
        <Text
          style={[userInfoStyles.userInfoText, userInfoStyles.textMarginBottom]}
        >
          We will {contact.type === 'email' ? 'email' : 'text'}{' '}
          {newContactNameStr}
          {contact.displayValue}. They will be required to verify their{' '}
          {contact.type === 'email' ? 'email address' : 'phone number'}.
        </Text>
      )}
      {!isMatch && (
        <View>
          <Text
            style={[
              userInfoStyles.userInfoText,
              userInfoStyles.textMarginBottom
            ]}
          >
            Once verified, this transaction will process{' '}
            <Text style={userInfoStyles.bold}>automatically</Text> the next time
            you open Lumenette.
          </Text>
          <Text
            style={[
              userInfoStyles.userInfoText,
              userInfoStyles.textMarginBottom
            ]}
          >
            You can cancel this transfer until they claim it. It will expire in
            10 days.{' '}
          </Text>
          <Text style={[userInfoStyles.userInfoText]}>
            <TextLink to="/main/more/learn-about-lumenette">
              Learn how Lumenette works.
            </TextLink>
          </Text>
        </View>
      )}
    </View>
  );
};

const userInfoStyles = StyleSheet.create({
  userInfoTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  userInfoLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colorBlue
  },
  userInfoContain: {
    backgroundColor: theme.colorCoolBg,
    flex: 1,
    padding: 20
  },
  bold: {
    fontFamily: theme.fontBodyBold
  },
  userInfoText: {
    color: theme.colorDarkBlue,
    fontSize: 18,
    fontFamily: theme.fontBodyRegular
  },
  userInfoTitleText: {
    backgroundColor: theme.colorBlue,
    color: 'white',
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    overflow: 'hidden',
    fontFamily: theme.fontBodyMedium,
    borderRadius: 4,
    fontSize: 15
  },
  textMarginBottom: {
    marginBottom: 20
  }
});

export default UserInfo;
