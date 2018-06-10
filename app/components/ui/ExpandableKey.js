import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard
} from 'react-native';
import Toast from 'react-native-root-toast';
import theme from 'app/lib/theme';

class ExpandableKey extends React.Component {
  static defaultProps = {
    copy: true,
    expanded: false
  };

  state = {expanded: this.props.expanded};

  expand = () => {
    if (this.props.handleExpand) {
      this.props.handleExpand();
    } else {
      this.setState({expanded: true});
    }
  };

  copy = () => {
    Clipboard.setString(this.props.keyStr);
    Toast.show('Copied to clipboard!', {
      position: Toast.positions.CENTER
    });
  };

  trunc = str => `${str.slice(0, 20)}...`;

  render() {
    return (
      <View style={addressStyles.address}>
        <Text style={addressStyles.addressTitle}>{this.props.title}</Text>
        <View
          style={[
            addressStyles.addressContent,
            this.state.expanded && addressStyles.addressContentOpen
          ]}
        >
          <Text style={addressStyles.addressContentText}>
            {this.props.keyStr
              ? this.state.expanded
                ? this.props.keyStr
                : this.trunc(this.props.keyStr)
              : 'Encrypted'}
          </Text>
          {!this.state.expanded && (
            <TouchableOpacity onPress={this.expand}>
              <Text style={addressStyles.addressContentPlus}>+</Text>
            </TouchableOpacity>
          )}
        </View>
        {this.props.copy &&
          !!this.props.keyStr && (
            <TouchableOpacity onPress={this.copy}>
              <Text style={addressStyles.addressCopy}>Copy</Text>
            </TouchableOpacity>
          )}
      </View>
    );
  }
}

const addressStyles = StyleSheet.create({
  addressTitle: {
    fontSize: 18,
    fontFamily: theme.fontBodyRegular,
    color: theme.colorDarkBlue,
    marginBottom: 5
  },
  addressContent: {
    backgroundColor: theme.colorSectionDivider,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5
  },
  addressContentOpen: {
    paddingVertical: 10
  },
  addressContentText: {
    fontSize: 16,
    color: theme.colorDarkBlue,
    fontFamily: theme.fontBodyRegular
  },
  addressContentPlus: {
    fontSize: 32,
    color: theme.colorDarkBlue,
    fontFamily: theme.fontBoldRegular
  },
  addressCopy: {
    textAlign: 'right',
    fontFamily: theme.fontRegular,
    fontSize: 16,
    paddingVertical: 10,
    color: theme.colorDarkBlue
  }
});

export default ExpandableKey;
