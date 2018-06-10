import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet
} from 'react-native';
import {StatusBar, KeyboardScroll, FormInput, Button} from 'app/components/ui';
import {withRouter} from 'react-router-native';
import {compose, connect} from 'app/core';
import {deleteAccount} from 'app/core/actions/replaceKey';
import theme from 'app/lib/theme';

const CONFIRM_TEXT = 'LUMENETTE REMOVE';

class DeleteModal extends React.Component {
  state = {
    deleteConfirmText: ''
  };

  deleteAccount = () => {
    this.props.deleteAccount();
    this.props.history.push('/welcome');
  };

  render() {
    const confirmedDelete =
      this.state.deleteConfirmText.trim() === CONFIRM_TEXT;

    return (
      <Modal animationType="slide" onRequestClose={this.props.onRequestClose}>
        <View style={deleteStyles.contain}>
          <StatusBar
            backgroundColor={theme.colorRed}
            barStyle="light-content"
          />
          <View style={deleteStyles.header}>
            <View style={deleteStyles.headerOuter}>
              <TouchableOpacity onPress={this.props.onRequestClose}>
                <Image
                  style={deleteStyles.close}
                  source={require('app/assets/images/icons/close.png')}
                />
              </TouchableOpacity>
            </View>
            <Text style={deleteStyles.headerText}>🚑 Danger Zone!</Text>
            <View style={deleteStyles.headerOuter} />
          </View>
          <KeyboardScroll>
            <View style={deleteStyles.content}>
              <View style={deleteStyles.textContain}>
                <Text style={deleteStyles.text}>
                  Removing an address from Lumenette deletes your keys from the
                  app. If you have a balance, please make sure that you have
                  copied your public and secret key prior to continuing, or you
                  will not be able to recover your funds.
                </Text>
                <Text style={deleteStyles.text}>
                  If you wish to proceed, to either stop using Lumenette, or to
                  use another public key, please type{' '}
                  <Text style={deleteStyles.bold}>{CONFIRM_TEXT}</Text>.
                </Text>
              </View>
              <FormInput
                label="Confirmation"
                placeholder={CONFIRM_TEXT}
                value={this.state.deleteConfirmText}
                autoCapitalize="characters"
                onChangeText={deleteConfirmText => {
                  this.setState({deleteConfirmText});
                }}
              />
              <Button
                title="Verify"
                disabled={!confirmedDelete}
                onPress={this.deleteAccount}
              />
            </View>
          </KeyboardScroll>
        </View>
      </Modal>
    );
  }
}

const deleteStyles = StyleSheet.create({
  contain: {flex: 1},
  header: {
    backgroundColor: theme.colorRed,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerOuter: {
    flex: 1
  },
  headerText: {
    flex: 3,
    fontFamily: theme.fontRegular,
    fontSize: 24,
    color: 'white',
    textAlign: 'center'
  },
  content: {padding: 20},
  textContain: {marginTop: 10},
  text: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    marginBottom: 15
  },
  bold: {
    fontFamily: theme.fontBodyBold
  }
});

export default compose(
  withRouter,
  connect(null, {deleteAccount})
)(DeleteModal);
