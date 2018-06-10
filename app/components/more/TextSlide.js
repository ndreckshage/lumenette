import React from 'react';
import {View, StyleSheet, Text, InteractionManager} from 'react-native';
import {StatusBar, SimpleHeader, KeyboardScroll} from 'app/components/ui';
import {withRouter} from 'react-router-native';
import theme from 'app/lib/theme';

class TextSlide extends React.Component {
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const position = this.paraPositions[this.props.scrollTo];
      if (this.scroller && position) {
        this.scroller.scrollToPosition(0, position);
      }
    });
  }

  paraPositions = [];

  back = () => this.props.history.push('/main/more');

  render() {
    return (
      <View style={styles.contain}>
        <StatusBar />
        <SimpleHeader onLeftButtonPress={this.back} title={this.props.title} />
        <KeyboardScroll
          extraHeight={100}
          kbRef={scroller => (this.scroller = scroller)}
        >
          <View style={styles.content}>
            {this.props.paragraphs.map((para, ndx) => (
              <Text
                onLayout={e => {
                  this.paraPositions[para.key] = e.nativeEvent.layout.y;
                }}
                style={[
                  styles.para,
                  this.props.paragraphs.length - 1 === ndx && styles.last
                ]}
                key={ndx}
              >
                {para}
              </Text>
            ))}
          </View>
        </KeyboardScroll>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: {flex: 1},
  content: {padding: 20},
  para: {
    color: theme.colorDarkBlue,
    fontSize: 18,
    fontFamily: theme.fontBodyRegular,
    marginBottom: 20
  },
  last: {
    marginBottom: 0
  }
});

export default withRouter(TextSlide);
