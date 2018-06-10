import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  StatusBar
} from "react-native";
import { Link, withRouter } from "react-router-native";
import Swiper from "react-native-swiper";
import theme from "app/lib/theme";
import { TextLink, Button } from "app/components/ui";
import BetaValidator from "app/components/welcome/BetaValidator";
import { selectors, connect, compose, actions } from "app/core";

const SkipLink = compose(
  withRouter,
  connect(
    state => ({
      hasCompletedOnboarding: selectors.selectHasCompletedOnboarding(state),
      needsBeta: selectors.selectNeedsBeta(state)
    }),
    {
      markIntroComplete: actions.markIntroComplete
    }
  )
)(props => {
  return (
    <Link
      to={
        props.hasCompletedOnboarding
          ? "/main/more"
          : "/onboarding/account-created"
      }
      style={styles.skipLinkWrap}
      underlayColor="transparent"
      onPress={e => {
        if (props.needsBeta) {
          e.preventDefault();
          props.setBeta(true);
        } else {
          props.markIntroComplete();
        }
      }}
    >
      <Text style={[styles.skipLink, { color: props.color || "white" }]}>
        {props.text || "SKIP"}
      </Text>
    </Link>
  );
});

class SlideWrap extends React.Component {
  state = { containerWidth: 0, containerHeight: 0 };

  handleLayout = e => {
    this.setState({
      containerWidth: e.nativeEvent.layout.width,
      containerHeight: e.nativeEvent.layout.height
    });
  };

  render() {
    return (
      <View
        style={[
          slideWrapStyles.contain,
          {
            backgroundColor:
              this.props.color === "blue" ? theme.colorMedBlue : "#fff"
          }
        ]}
        onLayout={this.handleLayout}
      >
        <SkipLink
          color={this.props.color === "blue" ? "#fff" : theme.colorBlue}
          setBeta={this.props.setBeta}
          text={this.props.linkText}
        />
        <View
          style={{
            height: this.props.forceHeight
              ? this.props.forceHeight
              : this.state.containerHeight - 60
          }}
        >
          <ScrollView contentContainerStyle={[slideWrapStyles.slideContain]}>
            <View style={slideWrapStyles.slide}>{this.props.children}</View>
          </ScrollView>
          <Image
            source={
              this.props.color === "blue"
                ? require("app/assets/images/med-blue-text-grad.png")
                : require("app/assets/images/white-text-grad.png")
            }
            resizeMode="stretch"
            style={[
              slideWrapStyles.gradient,
              { width: this.state.containerWidth }
            ]}
          />
        </View>
      </View>
    );
  }
}

const slideWrapStyles = StyleSheet.create({
  contain: { flex: 1 },
  slide: { padding: 25, paddingTop: 75, paddingBottom: 50 },
  gradient: { position: "absolute", bottom: 0, height: 50 }
});

const SlideWelcome_ = props => (
  <SlideWrap color="white" {...props}>
    <Image
      source={require("app/assets/images/logo-no-text.png")}
      style={welcomeStyles.stellar}
    />
    <Text style={styles.header}>A Stellar Lumen Wallet</Text>
    <View style={styles.textP}>
      <Text style={styles.text}>
        Lumenette is a mobile, cryptocurrency wallet to send and receive Stellar
        Lumen with your contacts.
      </Text>
    </View>
    <Text style={styles.text}>
      Swipe left to learn more about Lumenette and Stellar Lumen. Or{" "}
      <TextLink
        onPress={() => {
          if (props.needsBeta) {
            props.setBeta(true);
          } else {
            if (props.hasCompletedOnboarding) {
              props.history.push("/main/more");
            } else {
              props.markIntroComplete();
              props.history.push("/onboarding/account-created");
            }
          }
        }}
      >
        skip
      </TextLink>{" "}
      to get started. To the moon!
    </Text>
  </SlideWrap>
);

const SlideWelcome = compose(
  withRouter,
  connect(
    state => ({
      hasCompletedOnboarding: selectors.selectHasCompletedOnboarding(state),
      needsBeta: selectors.selectNeedsBeta(state)
    }),
    {
      markIntroComplete: actions.markIntroComplete
    }
  )
)(SlideWelcome_);

const welcomeStyles = StyleSheet.create({
  stellar: { width: 116, height: 170, marginBottom: 15 }
});

const SlideStellar_ = props => (
  <SlideWrap color="white" {...props}>
    <Image
      source={require("app/assets/images/welcome/stellar-w-text.png")}
      style={stellarStyles.stellar}
    />
    <Text style={styles.header}>Stellar Lumen</Text>
    <View style={styles.textP}>
      <Text style={styles.text}>
        Stellar Lumen is a cryptocurrency (like Bitcoin) known for fast & low
        cost transfers (unlike Bitcoin).
      </Text>
    </View>
    <View style={styles.textP}>
      <Text style={styles.text}>
        Stellar is the network that validates transactions. Lumen (or XLM) is
        Stellar&apos;s native crypto asset that fuels the network.
      </Text>
    </View>
    <Text style={[styles.text, styles.boldText]}>
      Current Price: {props.symbol}
      {props.rate}
    </Text>
  </SlideWrap>
);

const SlideStellar = connect(state => ({
  symbol: selectors.selectPreferredCurrencySymbol(state),
  rate: selectors.selectLumenDisplayRate(state)
}))(SlideStellar_);

const stellarStyles = StyleSheet.create({
  stellar: { width: 213, height: 135, marginBottom: 15 }
});

class SlidePayAnyone extends React.Component {
  state = { containerWidth: 0 };

  handleLayout = e => {
    this.setState({ containerWidth: e.nativeEvent.layout.width });
  };

  render() {
    return (
      <SlideWrap color="blue" {...this.props}>
        <Text style={[styles.header, styles.whiteText]}>Pay Anyone Lumen</Text>
        <Text style={[styles.textP, styles.text, styles.whiteText]}>
          Stellar lets you pay anyone in the world, instantly, with extremely
          low fees (1/1000th of a penny).
        </Text>
        <Text style={[styles.textP, styles.text, styles.whiteText]}>
          Lumenette notifies (and verifies) new users by email or text, before
          completing the transaction.
        </Text>
        <View onLayout={this.handleLayout} style={payAnyoneStyles.image}>
          <Image
            source={require("app/assets/images/welcome/contacts.png")}
            style={{
              width: this.state.containerWidth,
              height: this.state.containerWidth * 216 / 265
            }}
          />
        </View>
      </SlideWrap>
    );
  }
}

const payAnyoneStyles = StyleSheet.create({
  image: {
    marginTop: 10,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowColor: "black",
    shadowOffset: { height: 0, width: 0 }
  }
});

class SlideValue extends React.Component {
  state = { containerWidth: 0 };

  handleLayout = e => {
    this.setState({ containerWidth: e.nativeEvent.layout.width });
  };

  render() {
    return (
      <SlideWrap color="white" {...this.props}>
        <Image
          source={require("app/assets/images/welcome/racing.png")}
          style={valueStyles.image}
        />
        <Text style={styles.header}>Why Valuable?</Text>
        <Text style={[styles.textP, styles.text]}>
          The Stellar Network was designed to compliment fiat assets (US Dollar,
          Euro, etc), not to replace them.
        </Text>
        <Text style={[styles.textP, styles.text]}>
          Major corporations like <Text style={styles.boldText}>IBM</Text> are
          working with Stellar to improve & modernize existing financial
          systems.
        </Text>
        <Text style={styles.text}>
          Stellar allows individuals, banks, companies and governments to use
          traditional assets more efficiently - with crypto technology. Lumen
          (the currency) powers this network.
        </Text>
      </SlideWrap>
    );
  }
}

const valueStyles = StyleSheet.create({
  image: { width: 97, height: 158, marginBottom: 15 }
});

class SlideGlobal extends React.Component {
  state = { containerWidth: 0, containerHeight: 0 };

  handleLayout = e => {
    this.setState({
      containerWidth: e.nativeEvent.layout.width,
      containerHeight: e.nativeEvent.layout.height
    });
  };

  render() {
    const globeHeight = this.state.containerWidth * 287 / 320;
    const globeOffset = globeHeight * 0.33;
    const innerHeight =
      this.state.containerHeight - globeHeight + globeOffset - 20;

    return (
      <View style={globalStyles.contain} onLayout={this.handleLayout}>
        <SlideWrap color="white" forceHeight={innerHeight} {...this.props}>
          <Text style={styles.header}>Global</Text>
          <View style={styles.textP}>
            <Text style={styles.text}>
              Stellar.org oversees the Stellar Network. They are a non-profit
              whose mission is to provide low-cost financial services to fight
              poverty.
            </Text>
          </View>
          <Text style={styles.text}>
            Lumens have liquidity in markets throughout the world, reducing
            cross-border remittance costs.
          </Text>
        </SlideWrap>
        <Image
          source={require("app/assets/images/welcome/globe.png")}
          style={[
            globalStyles.bgImage,
            {
              width: this.state.containerWidth,
              height: globeHeight,
              bottom: -globeOffset
            }
          ]}
        />
      </View>
    );
  }
}

const globalStyles = StyleSheet.create({
  contain: { backgroundColor: "white", flex: 1 },
  bgImage: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 1
  }
});

class SlideGreen extends React.Component {
  state = { containerWidth: 0 };

  handleLayout = e => {
    this.setState({ containerWidth: e.nativeEvent.layout.width });
  };

  render() {
    return (
      <SlideWrap color="white" {...this.props}>
        <Image
          source={require("app/assets/images/welcome/recycle.png")}
          style={recycleStyles.image}
        />
        <Text style={styles.header}>Eco-Friendly</Text>
        <View style={styles.textP}>
          <Text style={styles.text}>
            Lumen isn’t a mined coin (unlike Bitcoin). There is a minimal carbon
            footprint.
          </Text>
        </View>
        <View style={styles.textP}>
          <Text style={styles.text}>
            The Stellar Network validates transactions by a consensus protocol
            (majority vote) of other computers on the network, rather than
            &ldquo;proof of work&rdquo;, energy intensive mining.
          </Text>
        </View>
      </SlideWrap>
    );
  }
}

const recycleStyles = StyleSheet.create({
  image: {
    width: 113,
    height: 109,
    marginBottom: 10
  }
});

class SlideSecureComponent extends React.Component {
  state = { containerWidth: 0, containerHeight: 0 };

  handleLayout = e => {
    this.setState({
      containerWidth: e.nativeEvent.layout.width,
      containerHeight: e.nativeEvent.layout.height
    });
  };

  render() {
    const forceHeight = this.state.containerHeight - 150;
    return (
      <View style={secureStyles.contain} onLayout={this.handleLayout}>
        <View style={{ height: forceHeight }}>
          <SlideWrap
            color="blue"
            linkText="START"
            forceHeight={forceHeight}
            {...this.props}
          >
            <Image
              source={require("app/assets/images/welcome/lock.png")}
              style={secureStyles.image}
            />
            <Text style={[styles.header, styles.whiteText]}>Secure</Text>
            <View style={styles.textP}>
              <Text style={[styles.text, styles.whiteText]}>
                Secret keys are generated by and kept on your device. Not a
                central server.
              </Text>
            </View>
            <View style={styles.textP}>
              <Text style={[styles.text, styles.whiteText]}>
                The Lumenette team does not have the capability to transfer on
                your behalf. Only you can access your funds.
              </Text>
            </View>
            <View style={styles.textP}>
              <Text style={[styles.text, styles.whiteText]}>
                Lumenette offers in app features like Touch ID and PIN
                protection to help you keep your keys secure.
              </Text>
            </View>
          </SlideWrap>
        </View>
        <View style={{ marginTop: 10, paddingHorizontal: 25 }}>
          <Button
            variation="onboarding"
            title="Start!"
            inline
            onPress={() => {
              if (this.props.needsBeta) {
                this.props.setBeta(true);
              } else {
                if (this.props.hasCompletedOnboarding) {
                  this.props.history.push("/main/more");
                } else {
                  this.props.markIntroComplete();
                  this.props.history.push("/onboarding/account-created");
                }
              }
            }}
          />
        </View>
      </View>
    );
  }
}

const secureStyles = StyleSheet.create({
  contain: { backgroundColor: theme.colorMedBlue, flex: 1 },
  image: {
    width: 113,
    height: 148,
    marginBottom: 20
  }
});

const SlideSecure = compose(
  withRouter,
  connect(
    state => ({
      hasCompletedOnboarding: selectors.selectHasCompletedOnboarding(state),
      needsBeta: selectors.selectNeedsBeta(state)
    }),
    {
      markIntroComplete: actions.markIntroComplete
    }
  )
)(SlideSecureComponent);

class WelcomeScreen extends React.Component {
  state = { showBeta: false };

  componentDidMount() {
    StatusBar.setBarStyle("dark-content", true);
  }

  setBeta = showBeta => this.setState({ showBeta });

  render() {
    return (
      <View style={styles.contain}>
        <StatusBar backgroundColor="rgba(0,0,0,0)" translucent animated />
        {this.state.showBeta && (
          <BetaValidator onRequestClose={() => this.setBeta(false)} />
        )}
        <Swiper
          dotStyle={styles.dotStyle}
          activeDotStyle={styles.activeDotStyle}
          loop={false}
          onIndexChanged={i => {
            if ([2, 6].includes(i)) {
              StatusBar.setBarStyle("light-content", true);
            } else {
              StatusBar.setBarStyle("dark-content", true);
            }
          }}
        >
          <SlideWelcome setBeta={this.setBeta} />
          <SlideStellar setBeta={this.setBeta} />
          <SlidePayAnyone setBeta={this.setBeta} />
          <SlideValue setBeta={this.setBeta} />
          <SlideGlobal setBeta={this.setBeta} />
          <SlideGreen setBeta={this.setBeta} />
          <SlideSecure setBeta={this.setBeta} />
        </Swiper>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: { flex: 1 },
  dotStyle: {
    backgroundColor: "rgba(25, 54, 81, 0.15)",
    width: 16,
    height: 16,
    borderRadius: 10
  },
  activeDotStyle: {
    backgroundColor: "rgba(25, 54, 81, 0.3)",
    width: 16,
    height: 16,
    borderRadius: 10
  },
  slideContain: {
    flex: 1,
    paddingVertical: 60
  },
  slide: {
    paddingHorizontal: 25
  },
  slideTopContain: {
    marginBottom: 15
  },
  header: {
    color: theme.colorBlue,
    fontFamily: theme.fontBold,
    backgroundColor: "transparent",
    fontSize: 32,
    marginBottom: 10
  },
  whiteText: {
    color: "#fff"
  },
  text: {
    color: theme.colorDarkBlue,
    backgroundColor: "transparent",
    fontSize: 18,
    lineHeight: 32,
    alignSelf: "flex-start",
    fontFamily: theme.fontBodyMedium
  },
  boldText: {
    fontFamily: theme.fontBodyBold
  },
  textP: {
    marginBottom: 20,
    alignSelf: "flex-start"
  },
  skipLinkWrap: {
    position: "absolute",
    zIndex: 1,
    top: 30,
    right: 20
  },
  skipLink: {
    fontFamily: theme.fontBodyMedium,
    color: "#72CEC6",
    fontSize: 18,
    zIndex: 100
  },
  marginBottom: {
    marginBottom: 20
  },
  marginTop: {
    marginTop: 20
  }
});

export default WelcomeScreen;
