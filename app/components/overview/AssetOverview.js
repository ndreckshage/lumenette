import React from "react";
import Lottie from "lottie-react-native";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Animated,
  Text
} from "react-native";
import theme from "app/lib/theme";

const LOGO_H_RATIO = 89 / 240;
const LOGO_V_RATIO = 130 / 314;
const ANIMATION_RATIO = 1256 / 960;
const ANIMATION_H_OFFSET_RATIO = 60 / 320;
const ANIMATION_V_OFFSET_RATIO = 12 / 419;

const animStart = new Animated.Value(0);

class AssetOverview extends React.Component {
  render() {
    const niceRatio = 375 / 543;
    const diffRatio = niceRatio / this.props.ratio;

    return (
      <ScrollView
        contentContainerStyle={styles.mainContentScroll}
        refreshControl={
          <RefreshControl
            refreshing={this.props.active && this.props.refreshing}
            onRefresh={this.props.handleRefresh}
            tintColor={theme.colorBlue}
          />
        }
      >
        <View style={styles.mainContent}>
          <View
            style={{
              width: this.props.containerWidth * LOGO_H_RATIO * diffRatio,
              height:
                this.props.containerWidth *
                ANIMATION_RATIO *
                LOGO_V_RATIO *
                diffRatio,
              position: "relative"
            }}
          >
            <View
              style={{
                width: this.props.containerWidth,
                height: this.props.containerWidth * ANIMATION_RATIO * diffRatio,
                position: "absolute",
                left:
                  -this.props.containerWidth *
                  ANIMATION_H_OFFSET_RATIO *
                  diffRatio,
                bottom:
                  -this.props.containerWidth *
                  ANIMATION_RATIO *
                  ANIMATION_V_OFFSET_RATIO *
                  diffRatio
              }}
            >
              <Lottie
                source={this.props.source}
                style={{
                  width: this.props.containerWidth * diffRatio,
                  height:
                    this.props.containerWidth * ANIMATION_RATIO * diffRatio
                }}
                progress={this.props.active ? this.props.progress : animStart}
              />
            </View>
          </View>
          {this.props.zeroBalance ? (
            this.props.zeroBalanceComponent
          ) : (
            <View style={styles.pricesContain}>
              <View style={styles.priceLumenContain}>
                <Text style={styles.priceLumen}>{this.props.balanceFull}</Text>
                <View>
                  {this.props.assetImage}
                  {this.props.balancePart && (
                    <Text style={styles.priceLumenSmall}>
                      .{this.props.balancePart}
                    </Text>
                  )}
                </View>
              </View>
              <View style={styles.priceFiatContain}>
                <Text style={styles.priceFiatSymbol}>
                  {this.props.rateSymbol}
                </Text>
                <Text style={styles.priceFiat}>{this.props.fiatBalance}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContentScroll: { flex: 1 },
  mainContent: { alignItems: "center", justifyContent: "center", flex: 1 },
  pricesContain: { marginTop: 20 },
  priceLumenContain: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  priceLumen: {
    fontFamily: theme.fontRegular,
    fontSize: 60,
    color: theme.colorDarkBlue,
    paddingRight: 5
  },
  priceFiatContain: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center"
  },
  priceFiatSymbol: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: theme.fontLight,
    color: theme.colorDarkBlue,
    paddingTop: 5
  },
  priceFiat: {
    textAlign: "center",
    fontFamily: theme.fontLight,
    color: theme.colorDarkBlue,
    fontSize: 36
  },
  priceLumenSmall: {
    fontSize: 15,
    fontFamily: theme.fontRegular,
    color: theme.colorDarkBlue
  }
});

export default AssetOverview;
