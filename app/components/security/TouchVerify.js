import React from 'react';
import {View, AppState, Image, StyleSheet} from 'react-native';
import {withRouter} from 'react-router-native';
import {connect, actions, compose} from 'app/core';
import {Button, TextLink} from 'app/components/ui';
import DeleteModal from 'app/components/security/DeleteModal';

class TouchVerify extends React.Component {
  state = {
    showDeleteModal: false,
    appState: AppState.currentState
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    const skipLaunch =
      this.props.location.state && this.props.location.state.skipLaunch;

    if (!skipLaunch) {
      this.verify();
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (this.state.appState === 'background' && nextAppState !== 'background') {
      this.verify();
    }

    this.setState({appState: nextAppState});
  };

  verify = async () => {
    try {
      const verified = await this.props.verifyTouchId();
      if (verified) {
        if (this.props.location.state.maintenanceMode) {
          const stillMaintenance = await this.props.checkMaintenance();
          if (stillMaintenance) {
            this.props.history.push('/maintenance-mode');
            return;
          }
        }

        this.props.history.push(this.props.location.state.naturalLocation);
      }
    } catch (e) {
      // user failed verification
      return;
    }
  };

  openDelete = () => this.setState({showDeleteModal: true});
  closeDelete = () => this.setState({showDeleteModal: false});

  render() {
    return (
      <View style={tvStyles.contain}>
        <View style={tvStyles.inner}>
          {this.state.showDeleteModal && (
            <DeleteModal onRequestClose={this.closeDelete} />
          )}
          <Image
            style={tvStyles.logo}
            source={require('app/assets/images/logo.png')}
          />
          <View style={tvStyles.buttonContain}>
            <Button
              title="Verify with TouchID"
              onPress={this.verify}
              variation="blue"
            />
          </View>
          <TextLink title="Recover Account" onPress={this.openDelete} />
        </View>
      </View>
    );
  }
}

const tvStyles = StyleSheet.create({
  contain: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  inner: {
    alignItems: 'center'
  },
  buttonContain: {
    marginBottom: 20
  },
  logo: {
    width: 152,
    height: 211,
    marginBottom: 40
  }
});

export default compose(
  withRouter,
  connect(null, {
    verifyTouchId: actions.verifyTouchId,
    checkMaintenance: actions.checkMaintenance
  })
)(TouchVerify);
