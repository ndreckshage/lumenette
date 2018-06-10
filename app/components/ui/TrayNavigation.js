import React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { withRouter } from "react-router-native";
import theme from "app/lib/theme";
import DeviceInfo from "react-native-device-info";

const isIphoneX = DeviceInfo.getModel() === "iPhone X";

const TrayNavigation = props => {
  const overviewActive = props.location.pathname === "/main";
  const transferActive = props.location.pathname.includes("/main/transfer");
  const activityActive = props.location.pathname.includes("/main/activity");
  const moreActive = props.location.pathname.includes("/main/more");

  const goTo = route => () => {
    props.history.push(route);
  };

  return (
    <View style={styles.contain}>
      <TouchableOpacity onPress={goTo("/main")} style={styles.itemStyle}>
        {overviewActive ? (
          <Image
            style={[styles.iconStyle, styles.iconOverview]}
            source={require("app/assets/images/tray/overview-on.png")}
          />
        ) : (
          <Image
            style={[styles.iconStyle, styles.iconOverview]}
            source={require("app/assets/images/tray/overview-off.png")}
          />
        )}
        <Text
          style={[styles.iconText, overviewActive && styles.activeIconText]}
        >
          Overview
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goTo("/main/transfer")}
        style={styles.itemStyle}
      >
        {transferActive ? (
          <Image
            style={[styles.iconStyle, styles.iconTransfer]}
            source={require("app/assets/images/tray/transfer-on.png")}
          />
        ) : (
          <Image
            style={[styles.iconStyle, styles.iconTransfer]}
            source={require("app/assets/images/tray/transfer-off.png")}
          />
        )}
        <Text
          style={[styles.iconText, transferActive && styles.activeIconText]}
        >
          Transfer
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goTo("/main/activity")}
        style={styles.itemStyle}
      >
        {activityActive ? (
          <Image
            style={[styles.iconStyle, styles.iconActivity]}
            source={require("app/assets/images/tray/activity-on.png")}
          />
        ) : (
          <Image
            style={[styles.iconStyle, styles.iconActivity]}
            source={require("app/assets/images/tray/activity-off.png")}
          />
        )}
        <Text
          style={[styles.iconText, activityActive && styles.activeIconText]}
        >
          Activity
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goTo("/main/more")} style={styles.itemStyle}>
        {moreActive ? (
          <Image
            style={[styles.iconStyle, styles.iconMore]}
            source={require("app/assets/images/tray/more-on.png")}
          />
        ) : (
          <Image
            style={[styles.iconStyle, styles.iconMore]}
            source={require("app/assets/images/tray/more-off.png")}
          />
        )}
        <Text style={[styles.iconText, moreActive && styles.activeIconText]}>
          More
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contain: {
    flexDirection: "row",
    shadowOpacity: 1,
    shadowRadius: 4,
    shadowColor: "rgba(0, 0, 0, 0.14)",
    shadowOffset: { height: 0, width: 0 },
    backgroundColor: theme.colorBlue,
    paddingBottom: isIphoneX ? 15 : 0
  },
  itemStyle: {
    width: "25%",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 10
  },

  iconStyle: {
    marginBottom: 5
  },

  iconOverview: {
    width: 30,
    height: 20
  },

  iconTransfer: {
    width: 20,
    height: 22
  },

  iconActivity: {
    width: 21,
    height: 18
  },

  iconMore: {
    width: 25,
    height: 17
  },

  iconText: {
    color: theme.colorDarkBlue,
    fontFamily: theme.fontRegular
  },

  activeIconText: {
    color: "white"
  }
});

export default withRouter(TrayNavigation);
