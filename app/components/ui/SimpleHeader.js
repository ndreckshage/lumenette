import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import theme from 'app/lib/theme';

const SimpleHeader = props => (
  <View style={styles.contain}>
    <View style={styles.leftContain}>
      {props.onLeftButtonPress && (
        <TouchableOpacity
          onPress={props.onLeftButtonPress}
          style={styles.leftButton}
        >
          {props.leftButtonIcon === 'close' ? (
            <Image source={require('app/assets/images/icons/close-dark.png')} />
          ) : (
            <Image
              style={styles.arrowLeft}
              source={require('app/assets/images/icons/arrow-left.png')}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
    <Text style={styles.title}>{props.title}</Text>
    <View style={styles.leftContain} />
  </View>
);

const styles = StyleSheet.create({
  contain: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLightBorder,
    zIndex: 10
  },
  leftContain: {flex: 1},
  leftButton: {
    flex: 1,
    width: '100%',
    paddingLeft: 15,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  arrowLeft: {left: -5, width: 15, height: 24},
  title: {
    flex: 4,
    alignItems: 'center',
    fontSize: 15,
    fontFamily: theme.fontRegular,
    color: theme.colorDarkBlue,
    textAlign: 'center',
    padding: 15
  }
});

export default SimpleHeader;
