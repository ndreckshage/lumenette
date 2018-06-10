import React from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import ContactCard from 'app/components/transfer/ContactCard';
import theme from 'app/lib/theme';

const Header = props => {
  const contactCardProps = props.contact
    ? props.contact
    : (() => {
        const name = (() => {
          switch (props.filterMatchType) {
            case 'email':
              return 'Email';
            case 'phone':
              return 'SMS';
            case 'lumen':
              return 'XLM Address';
            case 'federation':
              return 'Federation Address';
            default:
              return '';
          }
        })();

        return {
          displayValue: props.contactsFilter,
          type: props.filterMatchType,
          name
        };
      })();

  return (
    <View>
      <View style={headerStyles.headerContain}>
        {props.close || props.back ? (
          <TouchableOpacity onPress={props.close || props.back}>
            <View style={headerStyles.closeContain}>
              {props.close ? (
                <Image
                  style={headerStyles.close}
                  source={require('app/assets/images/icons/close.png')}
                />
              ) : (
                <Image
                  style={headerStyles.close}
                  source={require('app/assets/images/icons/arrow-left-white.png')}
                />
              )}
            </View>
          </TouchableOpacity>
        ) : (
          <View style={headerStyles.iconPlaceholder} />
        )}
        <View style={headerStyles.headerContentContain}>
          <Text style={headerStyles.headerTitle}>{props.title}</Text>
        </View>
      </View>
      <View style={headerStyles.contactCardWrap}>
        <ContactCard {...contactCardProps} />
      </View>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  headerContain: {
    backgroundColor: theme.colorBlue,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerContentContain: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 38
  },
  headerTitle: {
    fontFamily: theme.fontRegular,
    paddingVertical: 10,
    fontSize: 18,
    color: 'white'
  },
  contactCardWrap: {
    borderColor: theme.colorLightBorder,
    borderBottomWidth: 1
  },
  iconPlaceholder: {
    width: 32
  },
  closeContain: {
    padding: 10
  }
});

export default Header;
