import React from "react";
import { WebView, View, Platform } from "react-native";
import { connect } from "app/core";
import {
  initializeStellarBridge,
  stellarBridgeMessage
} from "app/core/lib/bridgePromise";

import initializeInterop from "./interop";

const baseUrl = Platform.OS === "ios" ? "./" : "file:///android_asset/";
const vendorBundle = `./stellar-interop-bundle.js`;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <script src="${vendorBundle}"></script>
    <script type="text/javascript">
      const initializeInterop = ${initializeInterop};
      initializeInterop(window.StellarInterop);
    </script>
  </head>
  <body></body>
</html>
`;

class StellarInterop extends React.Component {
  setRef = bridge => {
    this.bridge = bridge;
  };

  onWebViewMessage = e => {
    if (e.nativeEvent.data === "__INITIALIZE_STELLAR_BRIDGE__") {
      this.props.initializeStellarBridge(this.bridge.postMessage);
    } else {
      this.props.stellarBridgeMessage(JSON.parse(e.nativeEvent.data));
    }
  };

  render() {
    return (
      <View style={{ height: 0, opacity: 0 }}>
        <WebView
          ref={this.setRef}
          source={{ html, baseUrl }}
          onMessage={this.onWebViewMessage}
        />
      </View>
    );
  }
}

export default connect(null, {
  initializeStellarBridge,
  stellarBridgeMessage
})(StellarInterop);
