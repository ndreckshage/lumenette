import React from "react";
import { StyleSheet, Animated } from "react-native";
import { withRouter } from "react-router-native";
import theme from "app/lib/theme";

class TextLink extends React.Component {
  state = {
    opacity: new Animated.Value(1)
  };

  handlePress = (...args) => {
    Animated.sequence([
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 200
      }),
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 200
      })
    ]).start();

    setTimeout(() => {
      if (this.props.to) {
        this.props.history.push(this.props.to);
      } else {
        this.props.onPress(...args);
      }
    }, 200);
  };

  render() {
    return (
      <Animated.Text
        style={[
          styles.textLink,
          {
            color: this.state.opacity.interpolate({
              inputRange: [0, 1],
              outputRange: ["rgba(46, 162, 219, 0.4)", "rgba(46, 162, 219, 1)"]
            })
          }
        ]}
        onPress={this.handlePress}
      >
        {this.props.title || this.props.children}
      </Animated.Text>
    );
  }
}

const styles = StyleSheet.create({
  textLink: {
    color: theme.colorBlue,
    fontFamily: theme.fontBodyMedium,
    textDecorationLine: "underline",
    textDecorationColor: theme.colorBlue
  }
});

export default withRouter(TextLink);
