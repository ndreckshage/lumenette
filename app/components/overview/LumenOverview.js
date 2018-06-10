import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TextLink } from "app/components/ui";
import theme from "app/lib/theme";
import { connect, selectors } from "app/core";
import AssetOverview from "./AssetOverview";

class LumenOverview extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.lumenBalance !== this.props.lumenBalance) {
      this.props.playAnimation();
    }
  }

  render() {
    const [lumenBalanceFull, lumenBalancePart] = this.props.lumenBalance.split(
      "."
    );

    const zeroBalanceComponent = (
      <View style={styles.pricesContain}>
        <Text style={styles.zeroWelcome}>Welcome!</Text>
        <Text style={styles.zeroMsg}>
          Your balance will display here. If you were notified about a transfer,
          be sure to <TextLink to="/main/more/account">verify</TextLink> your
          email / phone number.
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
        source={require("app/assets/animated-logo-xlm.json")}
        zeroBalance={this.props.zeroBalance}
        zeroBalanceComponent={zeroBalanceComponent}
        balanceFull={lumenBalanceFull}
        balancePart={lumenBalancePart}
        rateSymbol={this.props.lumenRateSymbol}
        fiatBalance={this.props.lumenFiatBalance}
        assetImage={
          <Image
            source={require("app/assets/images/lumen-rocket.png")}
            style={styles.priceLumenRocket}
          />
        }
      />
    );
  }
}

const styles = StyleSheet.create({
  pricesContain: { marginTop: 20 },
  priceLumenRocket: {
    width: 24,
    height: 31
  },
  zeroWelcome: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: theme.fontRegular,
    color: theme.colorDarkBlue
  },
  zeroMsg: {
    fontSize: 16,
    textAlign: "center",
    margin: 10,
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue
  }
});

const mapStateToProps = state => ({
  lumenRateSymbol: selectors.selectPreferredCurrencySymbol(state),
  zeroBalance: selectors.selectZeroBalance(state),
  lumenBalance: selectors.selectLumenDisplayBalance(state),
  lumenFiatBalance: selectors.selectLumenFiatDisplayBalance(state)
});

export default connect(mapStateToProps)(LumenOverview);
