import React from 'react';
import {View, Text, Image, StyleSheet, Linking} from 'react-native';
import {TextLink} from 'app/components/ui';
import theme from 'app/lib/theme';
import {connect, selectors} from 'app/core';
import AssetOverview from './AssetOverview';

class MobiusOverview extends React.Component {
  render() {
    const [balanceFull, balancePart] = this.props.bitcoinBalance.split('.');

    const zeroBalanceComponent = (
      <View style={styles.pricesContain}>
        <Text style={styles.zeroWelcome}>Mobius</Text>
        <Text style={styles.zeroMsg}>
          For Stellar powered Mobius (MOBI), visit{` `}
          <TextLink
            onPress={() => {
              Linking.openURL('https://interstellar.exchange');
            }}
          >
            Interstellar
          </TextLink>{' '}
          or another Stellar exchange.
        </Text>
      </View>
    );

    return (
      <AssetOverview
        active={this.props.active}
        refreshing={this.props.refreshing}
        handleRefresh={this.props.handleRefresh}
        containerWidth={this.props.containerWidth}
        progress={this.props.progress}
        ratio={this.props.ratio}
        source={require('app/assets/animated-logo-mobi.json')}
        zeroBalance={this.props.zeroBalance}
        zeroBalanceComponent={zeroBalanceComponent}
        balanceFull={balanceFull}
        balancePart={balancePart}
        rateSymbol={this.props.lumenRateSymbol}
        fiatBalance={this.props.lumenFiatBalance}
        assetImage={
          <Image
            source={require('app/assets/images/lumen-rocket.png')}
            style={styles.priceLumenRocket}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  pricesContain: {marginTop: 20},
  priceLumenRocket: {
    width: 24,
    height: 31
  },
  zeroWelcome: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: theme.fontRegular,
    color: theme.colorDarkBlue
  },
  zeroMsg: {
    fontSize: 16,
    textAlign: 'center',
    margin: 10,
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue
  }
});

const mapStateToProps = state => ({
  lumenRateSymbol: selectors.selectPreferredCurrencySymbol(state),
  zeroBalance: selectors.selectMobiusZeroBalance(state),
  bitcoinBalance: selectors.selectMobiusDisplayBalance(state),
  lumenFiatBalance: selectors.selectMobiusFiatDisplayBalance(state)
});

export default connect(mapStateToProps)(MobiusOverview);
