import React from 'react';
import {View, Image, Text, ScrollView} from 'react-native';
import KeyRevealer from 'app/components/security/KeyRevealer';
import {StatusBar} from 'app/components/ui';
import {selectors, connect} from 'app/core';
import theme from 'app/lib/theme';

class Maintenance extends React.Component {
  render() {
    const reason = (() => {
      if (this.props.forcedUpgrade) {
        return 'Your version of Lumenette is out of date. Please update to continue using Lumenette.';
      }

      if (this.props.reason) {
        return this.props.reason;
      }

      return 'Lumenette is in Maintenance Mode. Please check back soon or reach out to team@lumenette.com for support.';
    })();

    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View>
            <StatusBar />
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={{width: 119, height: 173, margin: 20}}
                source={require('app/assets/images/upside-down.png')}
              />
            </View>
            <View style={{paddingHorizontal: 25}}>
              <Text
                style={{
                  fontFamily: theme.fontBodyRegular,
                  fontSize: 18,
                  color: theme.colorDarkBlue,
                  paddingVertical: 25
                }}
              >
                {reason}
              </Text>
              <KeyRevealer />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect(state => ({
  forcedUpgrade: selectors.selectIsMaintenanceModeForceUpgrade(state),
  reason: selectors.selectMaintenanceModeReason(state)
}))(Maintenance);
