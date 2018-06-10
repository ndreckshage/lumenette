import React from "react";
import {
  View,
  StyleSheet,
  AppState,
  StatusBar,
  InteractionManager
} from "react-native";

import { createStore, applyMiddleware, compose } from "redux";
import { NativeRouter, Route, Switch, withRouter } from "react-router-native";
import SplashScreen from "react-native-splash-screen";
import { Provider, connect } from "react-redux";
import thunk from "redux-thunk";

import RouteTransition from "app/components/ui/RouteTransition";
import TrayNavigation from "app/components/ui/TrayNavigation";
import StellarInterop from "app/components/stellar/StellarInterop";

import Welcome from "app/components/welcome/Welcome";

import AccountCreated from "app/components/onboarding/AccountCreated";
import RecoverAccount from "app/components/onboarding/RecoverAccount";
import LinkAccount from "app/components/onboarding/LinkAccount";
import VerifyPhone from "app/components/onboarding/VerifyPhone";

import Overview from "app/components/overview/Overview";
import Transfer from "app/components/transfer/Transfer";
import Activity from "app/components/activity/Activity";
import More from "app/components/more/More";
import TouchVerify from "app/components/security/TouchVerify";
import PinValidator from "app/components/security/PinValidator";
import Maintenance from "app/components/security/MaintenanceMode";

import reducer, { loadInitialState, syncStorage } from "app/core/reducer";
import { actions, selectors } from "app/core";
import { openApp, refreshApp } from "app/core/actions/openApp";
// import {Notifications} from 'expo';

import { Sentry } from "react-native-sentry";
import { logError } from "app/lib/logger";
import { USE_SENTRY } from "react-native-dotenv";

if (USE_SENTRY === "true") {
  Sentry.config(
    "https://65bc09ab232e427b87cc68e80bb272ab:cbbd7426dedb4d2bbecaff642fd8a0e6@sentry.io/278734"
  ).install();
}

const middleware = applyMiddleware(thunk, syncStorage);
const globalStore = createStore(reducer, {}, middleware);
global.__redux_store__ = globalStore;

class Layout extends React.Component {
  state = {
    isReady: false,
    outerRouteTransition: false,
    outerIncrement: false,
    mainRouteTransition: false,
    mainTabIncrement: false,
    onboardingRouteTransition: false,
    onboardingIncrement: false,
    processPendingPromptPin: false,
    appState: AppState.currentState
  };

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    // this._notificationSubscription = Notifications.addListener(
    //   this.handleNotification
    // );

    this.setupApp().then(() => {
      this.setState({ isReady: true }, () => {
        SplashScreen.hide();
      });
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  componentWillReceiveProps(nextProps) {
    const currentOuterRouteOrder = this.selectOuterRouteOrder(this.props);
    const nextOuterRouteOrder = this.selectOuterRouteOrder(nextProps);
    const outerIncrement = nextOuterRouteOrder > currentOuterRouteOrder;
    const outerRouteTransition =
      nextOuterRouteOrder > 0 &&
      currentOuterRouteOrder > 0 &&
      nextOuterRouteOrder !== currentOuterRouteOrder;

    const currentOnboardingRouteOrder = this.selectOnboardingRouteOrder(
      this.props
    );
    const nextOnboardingRouteOrder = this.selectOnboardingRouteOrder(nextProps);
    const onboardingIncrement =
      nextOnboardingRouteOrder > currentOnboardingRouteOrder;
    const onboardingRouteTransition =
      nextOnboardingRouteOrder > 0 &&
      currentOnboardingRouteOrder > 0 &&
      nextOnboardingRouteOrder !== currentOnboardingRouteOrder;

    const currentMainRouteOrder = this.selectMainRouteOrder(this.props);
    const nextMainRouteOrder = this.selectMainRouteOrder(nextProps);
    const mainTabIncrement = nextMainRouteOrder > currentMainRouteOrder;
    const mainRouteTransition =
      nextMainRouteOrder > 0 &&
      currentMainRouteOrder > 0 &&
      nextMainRouteOrder !== currentMainRouteOrder;

    let processPendingPromptPin = this.state.processPendingPromptPin;
    if (
      nextProps.processPendingPromptPin &&
      this.props.processPendingPromptPin !== nextProps.processPendingPromptPin
    ) {
      processPendingPromptPin = true;
    }

    if (mainRouteTransition) {
      InteractionManager.runAfterInteractions(() => {
        this.props.checkPendingTransfers();
      });
    }

    if (
      !this.props.maintenanceMode &&
      nextProps.maintenanceMode &&
      this.props.history.location.pathname !== "/touch-verify"
    ) {
      this.props.history.push("/maintenance-mode");
    }

    this.setState({
      outerIncrement,
      outerRouteTransition,
      onboardingIncrement,
      onboardingRouteTransition,
      mainRouteTransition,
      mainTabIncrement,
      processPendingPromptPin
    });
  }

  _handleAppStateChange = async nextAppState => {
    let naturalLocation = this.props.history.location.pathname;
    // rely on route here rather than actual maintainance mode prop
    const maintenanceMode = naturalLocation === "/maintenance-mode";
    if (maintenanceMode) {
      naturalLocation = this.getDefaultNaturalLocation();
    }

    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.props.refreshApp();
      const onTouchIdPage =
        this.props.needsTouchId && naturalLocation !== "/touch-verify";

      if (!onTouchIdPage && maintenanceMode) {
        const stillMaintenance = await this.props.checkMaintenance();
        if (!stillMaintenance) {
          this.props.history.push(naturalLocation);
        }
      }
    } else if (
      this.state.appState !== "background" &&
      nextAppState === "background"
    ) {
      this.props.clearDecryptedKeypair();
      if (this.props.needsTouchId && naturalLocation !== "/touch-verify") {
        this.props.history.push("/touch-verify", {
          naturalLocation,
          maintenanceMode,
          skipLaunch: true
        });
      }
    }

    this.setState({ appState: nextAppState });
  };

  setupApp = async () => {
    try {
      try {
        const initialState = await loadInitialState();
        globalStore.dispatch({
          type: "__REPLACE_STATE__",
          payload: initialState
        });
      } catch (e) {
        logError(e, { fn: "setupApp 1" });
      }

      try {
        await this.props.openApp();
      } catch (e) {
        logError(e, { fn: "setupApp 2" });
      }

      const naturalLocation =
        this.props.history.location.pathname === "/maintenance-mode"
          ? "/maintenance-mode"
          : this.getDefaultNaturalLocation();

      if (this.props.needsTouchId) {
        this.props.history.push("/touch-verify", { naturalLocation });
      } else {
        this.props.history.push(naturalLocation);
      }
    } catch (e) {
      logError(e, { fn: "setupApp 3" });
    }
  };

  getDefaultNaturalLocation = () => {
    if (!this.props.hasCompletedIntro) {
      return "/welcome";
    } else if (!this.props.hasCompletedOnboarding) {
      return "/onboarding/account-created";
    }

    return "/main";
  };

  // handleNotification = notification => {
  //   if (notification.origin === 'received') {
  //     this.props.checkPendingTransfers();
  //   }
  //
  //   if (notification.origin === 'selected') {
  //     this.props.history.push('/main/activity');
  //   }
  // };

  selectOuterRouteOrder = (props = this.props) => {
    if (props.location.pathname.startsWith("/welcome")) {
      return 1;
    } else if (props.location.pathname.startsWith("/onboarding")) {
      return 2;
    } else if (props.location.pathname.startsWith("/main")) {
      return 3;
    } else {
      return 0;
    }
  };

  selectOnboardingRouteOrder = (props = this.props) => {
    if (props.location.pathname === "/onboarding/account-created") {
      return 1;
    } else if (props.location.pathname === "/onboarding/recover-account") {
      return 2;
    } else if (props.location.pathname === "/onboarding/link-account") {
      return 3;
    } else if (props.location.pathname === "/onboarding/verify-phone") {
      return 4;
    } else {
      return 0;
    }
  };

  selectMainRouteOrder = (props = this.props) => {
    if (props.location.pathname === "/main") {
      return 1;
    } else if (props.location.pathname.startsWith("/main/transfer")) {
      return 2;
    } else if (props.location.pathname.startsWith("/main/activity")) {
      return 3;
    } else if (props.location.pathname.startsWith("/main/more")) {
      return 4;
    } else {
      return 0;
    }
  };

  pinValidated = () => {
    this.props.checkPendingTransfers();
    this.closePinValidator();
  };

  closePinValidator = () => this.setState({ processPendingPromptPin: false });

  render() {
    if (!this.state.isReady) {
      return null;
    }

    return (
      <View style={styles.contain}>
        {!this.props.location.pathname.startsWith("/welcome") && (
          <StatusBar backgroundColor="white" barStyle="dark-content" />
        )}
        {this.state.processPendingPromptPin &&
          this.props.history.location.pathname !== "/touch-verify" && (
            <PinValidator
              handleValidate={this.pinValidated}
              onRequestClose={this.closePinValidator}
              processingTriggered
            />
          )}
        <RouteTransition
          transition={this.state.outerRouteTransition}
          increment={this.state.outerIncrement}
        >
          <Switch location={this.props.location}>
            <Route exact path="/welcome" component={Welcome} />
            <Route exact path="/touch-verify" component={TouchVerify} />
            <Route exact path="/maintenance-mode" component={Maintenance} />
            <Route
              path="/onboarding"
              render={() => (
                <RouteTransition
                  transition={this.state.onboardingRouteTransition}
                  increment={this.state.onboardingIncrement}
                >
                  <Switch location={this.props.location}>
                    <Route
                      exact
                      path="/onboarding/account-created"
                      component={AccountCreated}
                    />
                    <Route
                      exact
                      path="/onboarding/recover-account"
                      component={RecoverAccount}
                    />
                    <Route
                      exact
                      path="/onboarding/link-account"
                      component={LinkAccount}
                    />
                    <Route
                      exact
                      path="/onboarding/verify-phone"
                      component={VerifyPhone}
                    />
                  </Switch>
                </RouteTransition>
              )}
            />
            <Route
              path="/main"
              render={() => (
                <View style={styles.contain}>
                  <View style={styles.contain}>
                    <RouteTransition
                      transition={this.state.mainRouteTransition}
                      increment={this.state.mainTabIncrement}
                    >
                      <Switch location={this.props.location}>
                        <Route exact path="/main" component={Overview} />
                        <Route path="/main/transfer" component={Transfer} />
                        <Route path="/main/activity" component={Activity} />
                        <Route path="/main/more" component={More} />
                      </Switch>
                    </RouteTransition>
                  </View>
                  <TrayNavigation />
                </View>
              )}
            />
          </Switch>
        </RouteTransition>
      </View>
    );
  }
}

const LayoutContainer = compose(
  withRouter,
  connect(
    state => ({
      hasCompletedIntro: selectors.selectHasCompletedIntro(state),
      hasCompletedOnboarding: selectors.selectHasCompletedOnboarding(state),
      needsTouchId: selectors.selectNeedsTouchId(state),
      processPendingPromptPin: selectors.selectProcessPendingPinPrompt(state),
      maintenanceMode: selectors.selectIsMaintenanceMode(state)
    }),
    {
      openApp,
      refreshApp,
      checkMaintenance: actions.checkMaintenance,
      checkPendingTransfers: actions.checkPendingTransfers,
      clearDecryptedKeypair: actions.clearDecryptedKeypair
    }
  )
)(Layout);

const LayoutContainerWithStellarInterop = () => (
  <View style={styles.contain}>
    <StellarInterop />
    <LayoutContainer />
  </View>
);

const App = () => (
  <NativeRouter>
    <Provider store={globalStore}>
      <LayoutContainerWithStellarInterop />
    </Provider>
  </NativeRouter>
);

const styles = StyleSheet.create({
  contain: { flex: 1 }
});

export default App;
