import React from 'react';
import {
  View,
  Text,
  Animated,
  InteractionManager,
  StyleSheet
} from 'react-native';
import Swiper from 'react-native-swiper';
import {StatusBar} from 'app/components/ui';
import theme from 'app/lib/theme';
import {connect, actions, selectors} from 'app/core';
import ConfirmKeyBackup from 'app/components/security/ConfirmKeyBackup';

import LumenOverview from './LumenOverview';
import BitcoinOverview from './BitcoinOverview';
import EthereumOverview from './EthereumOverview';
import LitecoinOverview from './LitecoinOverview';
import MobiusOverview from './MobiusOverview';

const animStart = new Animated.Value(0);

class Overview extends React.Component {
  state = {
    progress: animStart,
    containerWidth: 0,
    containerHeight: 0,
    playing: false,
    temporarilyDismiss: false,
    refreshing: false,
    activeIndex: 0
  };

  componentDidMount() {
    this._mounted = true;
    InteractionManager.runAfterInteractions(() => {
      this.props.loadBalanceAndRates();
      if (this.props.location.state && this.props.location.state.liftoff) {
        this.playAnimation();
      }
    });
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  playAnimation = () => {
    if (this.state.playing) {
      return;
    }

    this.setState(
      {
        playing: true,
        progress: new Animated.Value(0)
      },
      () => {
        setTimeout(() => {
          Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 4000
          }).start(() => {
            if (this._mounted) {
              this.setState({playing: false});
            }
          });
        }, 500);
      }
    );
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.props.loadBalanceAndRates().then(() => {
          if (this._mounted) {
            this.setState({refreshing: false}, this.playAnimation);
          }
        });
      }
    );
  };

  handleLayout = e => {
    this.setState({
      containerWidth: e.nativeEvent.layout.width,
      containerHeight: e.nativeEvent.layout.height
    });
  };

  render() {
    const ratio = this.state.containerWidth / this.state.containerHeight;
    const slideProps = {
      ratio,
      handleRefresh: this.handleRefresh,
      playing: this.state.playing,
      progress: this.state.progress,
      refreshing: this.state.refreshing,
      containerWidth: this.state.containerWidth
    };

    let rate = this.props.lumenRate;
    let rateText = 'Lumen';
    let percentChange = this.props.lumenPercentChange.percentChange;
    let percentChangeNegative = this.props.lumenPercentChange.negative;

    if (this.state.activeIndex === 1) {
      rate = this.props.bitcoinRate;
      rateText = 'Bitcoin';
      percentChange = this.props.bitcoinPercentChange.percentChange;
      percentChangeNegative = this.props.bitcoinPercentChange.negative;
    } else if (this.state.activeIndex === 2) {
      rate = this.props.ethereumRate;
      rateText = 'Ether';
      percentChange = this.props.ethereumPercentChange.percentChange;
      percentChangeNegative = this.props.ethereumPercentChange.negative;
    } else if (this.state.activeIndex === 3) {
      rate = this.props.litecoinRate;
      rateText = 'Litecoin';
      percentChange = this.props.litcoinPercentChange.percentChange;
      percentChangeNegative = this.props.litcoinPercentChange.negative;
    } else if (this.state.activeIndex === 4) {
      rate = this.props.mobiusRate;
      rateText = 'Mobius';
      percentChange = this.props.mobiusPercentChange.percentChange;
      percentChangeNegative = this.props.mobiusPercentChange.negative;
    }

    return (
      <View style={styles.contain}>
        <StatusBar />
        <View style={styles.headerContain}>
          <Text style={styles.headerLumen}>
            {this.props.lumenRateSymbol}
            {rate} / {rateText}
          </Text>
          <Text
            style={[
              styles.headerHistory,
              percentChangeNegative && styles.headerHistoryNegative
            ]}
          >
            {percentChangeNegative ? '' : '+'}
            {percentChange}% (24 hours)
          </Text>
        </View>
        <View style={{flex: 1}} onLayout={this.handleLayout}>
          {!(this.props.location.state && this.props.location.state.liftoff) &&
            !this.props.hasBackedUpKeys &&
            !this.state.temporarilyDismiss && (
              <View style={styles.confirmKeyWrap}>
                <ConfirmKeyBackup
                  dismiss={() => {
                    this.setState({temporarilyDismiss: true});
                  }}
                />
              </View>
            )}
          <Swiper
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.activeDotStyle}
            loop={false}
            onIndexChanged={activeIndex => {
              this.setState({activeIndex});
            }}
          >
            <LumenOverview
              {...slideProps}
              playAnimation={this.playAnimation}
              active={this.state.activeIndex === 0}
            />
            <BitcoinOverview
              {...slideProps}
              active={this.state.activeIndex === 1}
            />
            <EthereumOverview
              {...slideProps}
              active={this.state.activeIndex === 2}
            />
            <LitecoinOverview
              {...slideProps}
              active={this.state.activeIndex === 3}
            />
            <MobiusOverview
              {...slideProps}
              active={this.state.activeIndex === 4}
            />
          </Swiper>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: {flex: 1},
  headerContain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colorLightBorder
  },
  headerLumen: {
    fontFamily: theme.fontRegular,
    fontSize: 15,
    color: theme.colorDarkBlue
  },
  headerHistory: {
    fontFamily: theme.fontRegular,
    fontSize: 15,
    color: theme.colorGreen
  },
  headerHistoryNegative: {color: theme.colorRed},
  confirmKeyWrap: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255, 0.5)',
    justifyContent: 'center',
    zIndex: 10,
    padding: 10,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  dotStyle: {
    backgroundColor: 'rgba(25, 54, 81, 0.15)',
    width: 16,
    height: 16,
    borderRadius: 10
  },
  activeDotStyle: {
    backgroundColor: 'rgba(25, 54, 81, 0.3)',
    width: 16,
    height: 16,
    borderRadius: 10
  }
});

const mapStateToProps = state => ({
  lumenRateSymbol: selectors.selectPreferredCurrencySymbol(state),
  hasBackedUpKeys: selectors.selectHasBackedUpKeys(state),

  lumenRate: selectors.selectLumenDisplayRate(state),
  lumenPercentChange: selectors.selectLumenPercentChange(state),

  bitcoinRate: selectors.selectBitcoinDisplayRate(state),
  bitcoinPercentChange: selectors.selectBitcoinPercentChange(state),

  ethereumRate: selectors.selectEthereumDisplayRate(state),
  ethereumPercentChange: selectors.selectEthereumPercentChange(state),

  litecoinRate: selectors.selectLitecoinDisplayRate(state),
  litcoinPercentChange: selectors.selectLitecoinPercentChange(state),

  mobiusRate: selectors.selectMobiusDisplayRate(state),
  mobiusPercentChange: selectors.selectMobiusPercentChange(state)
});

const mapDispatchToProps = {
  loadBalanceAndRates: actions.loadBalanceAndRates
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
