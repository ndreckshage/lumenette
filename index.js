import React from "react";
import { AppRegistry, View, PanResponder, NativeModules } from "react-native";
import { APP, DEV_MENU_OPENER } from "react-native-dotenv";
import App from "./app/App";

const DevMenuTrigger = ({ children }) => {
  if (DEV_MENU_OPENER !== "true") return children;

  const { DevMenu } = NativeModules;
  if (!DevMenu) return children;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => {
      if (gestureState.numberActiveTouches === 3) {
        DevMenu.show();
      }
    }
  });

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

class Core extends React.Component {
  render() {
    return (
      <DevMenuTrigger>
        <App title={APP} />
      </DevMenuTrigger>
    );
  }
}

AppRegistry.registerComponent("lumenette", () => Core);
