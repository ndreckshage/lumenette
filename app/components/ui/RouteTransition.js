import React from 'react';
import {Animated, View, StyleSheet, AppState} from 'react-native';
import {withRouter} from 'react-router-native';

class RouteTransition extends React.Component {
  state = {
    anim: new Animated.Value(10),
    appState: AppState.currentState
  };

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  componentWillReceiveProps(nextProps) {
    const skipTransition =
      nextProps.location.state && nextProps.location.state.transition === false;

    if (
      nextProps.transition &&
      !skipTransition &&
      this.state.appState === 'active'
    ) {
      this.setState(
        {
          anim: new Animated.Value(0),
          increment: nextProps.increment
        },
        () => {
          Animated.spring(this.state.anim, {
            toValue: 10,
            duration: 250
          }).start();
        }
      );
    }
  }

  _handleAppStateChange = appState => this.setState({appState});

  render() {
    return (
      <View style={styles.contain}>
        <Animated.View
          style={[
            styles.animatedContain,
            {
              left: this.state.anim.interpolate({
                inputRange: [0, 10],
                outputRange: [this.state.increment ? 25 : -25, 0]
              }),
              opacity: this.state.anim.interpolate({
                inputRange: [0, 10],
                outputRange: [0, 1]
              })
            }
          ]}
        >
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: {flex: 1},
  animatedContain: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0
  }
});

export default withRouter(RouteTransition);
