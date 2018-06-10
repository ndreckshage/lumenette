import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  AppState,
  ActivityIndicator,
  ScrollView,
  Image,
  Platform,
  TouchableOpacity,
  InteractionManager,
  SectionList
} from 'react-native';
import {StatusBar, Button, DismissKeyboard} from 'app/components/ui';
import {connect, actions, selectors} from 'app/core';
import TransferModal from 'app/components/transfer/TransferModal';
import PinValidator from 'app/components/security/PinValidator';
import ContactCard from 'app/components/transfer/ContactCard';
import Deferred from 'app/lib/Deferred';
import theme from 'app/lib/theme';

const PayAnyoneHead = () => (
  <View style={styles.payAnyoneContain}>
    <Text style={styles.headerFont}>
      Pay <Text style={styles.payAnyoneBold}>anyone</Text> on your contact list.
    </Text>
    <Text style={styles.headerFont}>We&apos;ll email / text them.</Text>
  </View>
);

class Transfer extends React.Component {
  state = {
    modalOpen: false,
    showPinValidator: false,
    modalItem: null,
    loadingContacts: this.props.contactsCount === 0
  };

  componentWillMount() {
    this.props.clearContactsFilter();
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    if (!this.props.routeAnimating) {
      this.loadContacts();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.routeAnimating && !this.props.routeAnimating) {
      this.loadContacts();
    }

    if (
      this.state.loadingContacts &&
      prevProps.contactsCount === 0 &&
      this.props.contactsCount !== 0
    ) {
      this.setState({loadingContacts: false});
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState !== 'active') {
      this.closeModal();
    }
  };

  loadContacts = () => {
    if (this.props.contactsCount === 0) {
      InteractionManager.runAfterInteractions(this.props.loadContacts);
    } else {
      InteractionManager.runAfterInteractions(() => {
        this.props.loadLumenContacts({cache: 1000 * 60 * 5});
      });
    }
  };

  deferredValidation = null;
  validatePin = () => {
    if (!this.props.hasEncryptedSecretKey || this.props.secretKeyIsDecrypted) {
      return Promise.resolve();
    }

    this.deferredValidation = new Deferred();
    this.setState({showPinValidator: true});

    return this.deferredValidation.promise;
  };

  pinValidated = () => {
    this.closePinValidator();
    this.deferredValidation.resolve();
  };

  closePinValidator = () => this.setState({showPinValidator: false});

  openModal = item => async () => {
    if (item.forceSearch) {
      this.props.handleContactsFilter(item.value);
      return;
    }

    try {
      await this.validatePin();
      this.setState({modalOpen: true, modalItem: item});
    } catch (e) {
      // failed validation
    }
  };

  openModalNoContact = async () => {
    try {
      await this.validatePin();
      this.setState({modalOpen: true, modalItem: null});
    } catch (e) {
      // failed validation
    }
  };

  closeModal = () => this.setState({modalOpen: false, modalItem: null});

  clear = () => this.props.handleContactsFilter('');

  render() {
    return (
      <View style={styles.contain}>
        <StatusBar />
        {this.state.showPinValidator && (
          <PinValidator
            handleValidate={this.pinValidated}
            onRequestClose={this.closePinValidator}
          />
        )}
        {this.state.modalOpen && (
          <TransferModal
            contact={this.state.modalItem}
            close={this.closeModal}
          />
        )}
        <PayAnyoneHead />
        <View style={styles.inputGroupContain}>
          <Text style={styles.inputToContain}>To:</Text>
          <TextInput
            style={styles.contactSearch}
            autoCorrect={false}
            autoCapitalize="none"
            placeholderTextColor={theme.colorPlaceholder}
            placeholder="Search contacts or enter a lumen address"
            onChangeText={this.props.handleContactsFilter}
            underlineColorAndroid="rgba(0,0,0,0)"
            value={this.props.contactsFilter}
          />
          {this.props.contactsFilter.length > 0 && (
            <TouchableOpacity onPress={this.clear}>
              <Image
                style={{padding: 10}}
                source={require('app/assets/images/icons/close-dark.png')}
              />
            </TouchableOpacity>
          )}
        </View>
        {this.props.contactsCount > 0 && (
          <DismissKeyboard>
            <SectionList
              sections={this.props.groupedContacts}
              keyExtractor={item => `${item.contactId}-${item.id}`}
              getItemLayout={(data, index) => ({
                length: 66.5,
                offset: 66.5 * index,
                index
              })}
              ItemSeparatorComponent={() => (
                <View style={styles.contactSeparator} />
              )}
              stickySectionHeadersEnabled
              renderSectionHeader={({section}) => (
                <View style={styles.allContactsDivider}>
                  <Text style={styles.allContactsDividerText}>
                    {section.title}
                  </Text>
                </View>
              )}
              renderItem={({item}) => (
                <TouchableOpacity onPress={this.openModal(item)}>
                  <ContactCard {...item} />
                </TouchableOpacity>
              )}
            />
          </DismissKeyboard>
        )}
        {this.props.contactsCount === 0 && (
          <View style={styles.noResultContain}>
            {this.props.filterMatchType ? (
              <Button
                title={`Send Lumen to ${(() => {
                  if (this.props.filterMatchType === 'lumen') {
                    return 'XLM address';
                  }

                  if (this.props.filterMatchType === 'federation') {
                    return 'Federation address';
                  }

                  return this.props.contactsFilter;
                })()}`}
                onPress={this.openModalNoContact}
              />
            ) : this.state.loadingContacts ? (
              <ActivityIndicator size="large" color={theme.colorBlue} />
            ) : (
              <Text style={styles.noResultText}>
                No matching contacts. And search is not a valid phone number,
                email or lumen address.
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: {flex: 1},
  payAnyoneContain: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    borderBottomColor: theme.colorLightBorder
  },
  headerFont: {
    fontFamily: theme.fontRegular,
    color: theme.colorDarkBlue,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center'
  },
  payAnyoneBold: {fontFamily: theme.fontBold},
  inputGroupContain: {
    paddingTop: Platform.OS === 'ios' ? 15 : 5,
    paddingBottom: Platform.OS === 'ios' ? 12 : 2,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputToContain: {
    fontSize: 16,
    fontFamily: theme.fontBodyMedium,
    color: theme.colorDarkBlue,
    marginRight: 4
  },
  contactSearch: {
    fontSize: 16,
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue,
    flex: 1
  },
  allContactsDivider: {
    backgroundColor: theme.colorSectionDivider,
    padding: 10
  },
  allContactsDividerText: {
    color: theme.colorDarkBlue,
    fontFamily: theme.fontRegular,
    fontSize: 15
  },
  contactSeparator: {
    backgroundColor: theme.colorLightBorder,
    height: 1
  },
  lastContactRow: {
    borderBottomWidth: 0
  },
  noResultContain: {
    borderTopWidth: 1,
    borderTopColor: theme.colorLightBorder,
    padding: 20
  },
  noResultText: {
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue,
    fontSize: 18
  }
});

const ConnectedTransfer = connect(
  state => ({
    groupedContacts: selectors.selectGroupedContacts(state),
    contactsCount: selectors.selectContactsCount(state),
    contactsFilter: selectors.selectContactsFilter(state),
    filterMatchType: selectors.selectFilterMatchType(state),
    hasEncryptedSecretKey: selectors.selectHasEncryptedSecretKey(state),
    secretKeyIsDecrypted: selectors.selectSecretKeyIsDecrypted(state)
  }),
  {
    clearContactsFilter: actions.clearContactsFilter,
    loadContacts: actions.loadContacts,
    loadLumenContacts: actions.loadLumenContacts,
    handleContactsFilter: actions.handleContactsFilter
  }
)(Transfer);

class TransferContactPermission_ extends React.Component {
  state = {
    grantedPermission: this.props.contactsCount > 0,
    ready: this.props.contactsCount > 0,
    androidRequestPermission: false
  };

  async componentWillMount() {
    this.mounted = true;
    const grantedPermission = await this.props.checkContactPermission(true);
    if (grantedPermission) {
      if (this.mounted) {
        this.setState({
          grantedPermission: true,
          ready: true
        });
      }
    } else if (
      Platform.OS === 'android' &&
      !this.props.androidContactPermissions
    ) {
      this.setState({ready: true, androidRequestPermission: true});
    } else {
      this.setState({ready: true});
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  grantAndroidPermission = () => {
    this.props.grantAndroidContactPermission();
    this.setState({androidRequestPermission: false, grantedPermission: true});
  };

  render() {
    if (!this.state.ready) {
      return null;
    }

    return this.state.grantedPermission ? (
      <ConnectedTransfer {...this.props} />
    ) : this.state.androidRequestPermission ? (
      <View style={styles.contain}>
        <PayAnyoneHead />
        <ScrollView>
          <View style={permissionStyles.androidRequestPermission}>
            <Text style={permissionStyles.androidRequestPermissionHead}>
              Allow Lumenette access to your contacts?
            </Text>
            <Text style={permissionStyles.androidRequestPermissionText}>
              Lumenette is a wallet that helps you transfer Lumens to any of
              your contacts by email or phone.
            </Text>
            <Text style={permissionStyles.androidRequestPermissionText}>
              Additionally, your contact information helps us display people you
              already know using Lumenette.
            </Text>
            <Button
              variation="blue"
              title="Allow"
              onPress={this.grantAndroidPermission}
            />
          </View>
        </ScrollView>
      </View>
    ) : (
      <View style={permissionStyles.upsideDownContain}>
        <Image
          style={permissionStyles.upsideDown}
          source={require('app/assets/images/upside-down.png')}
        />
        <Text style={permissionStyles.text}>
          Lumenette is a wallet that helps you transfer Lumens to your contacts.
          Please enable contacts permission in settings to use Lumenette!
        </Text>
      </View>
    );
  }
}

const TransferContactPermission = connect(
  state => ({
    contactsCount: selectors.selectContactsCount(state),
    androidContactPermissions: selectors.selectHasGrantedAndroidContactPermissions(
      state
    )
  }),
  {
    checkContactPermission: actions.checkContactPermission,
    grantAndroidContactPermission: actions.grantAndroidContactPermission
  }
)(TransferContactPermission_);

const permissionStyles = StyleSheet.create({
  upsideDownContain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  upsideDown: {
    width: 119,
    height: 173,
    marginBottom: 20
  },
  androidRequestPermission: {
    padding: 20
  },
  androidRequestPermissionHead: {
    fontFamily: theme.fontBodyBold,
    fontSize: 18,
    color: theme.colorDarkBlue,
    marginBottom: 15
  },
  androidRequestPermissionText: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    marginBottom: 15
  },
  text: {
    fontFamily: theme.fontBodyRegular,
    fontSize: 18,
    color: theme.colorDarkBlue,
    padding: 25
  }
});

export default TransferContactPermission;
