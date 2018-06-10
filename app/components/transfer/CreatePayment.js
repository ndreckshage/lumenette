import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  Platform,
  Text,
  StyleSheet
} from 'react-native';
import {compose} from 'redux';
import Big from 'bignumber.js';
import {withRouter} from 'react-router-native';
import {FormInput, Button, KeyboardScroll} from 'app/components/ui';
import theme from 'app/lib/theme';
import {selectors, connect} from 'app/core';

const QuickPick = props => (
  <View
    style={[
      quickPickStyles.contain,
      {
        width: props.wh - 20,
        height: props.wh - 20
      }
    ]}
  >
    <TouchableOpacity onPress={props.updateValue}>
      <View style={quickPickStyles.innerContain}>
        <Text style={quickPickStyles.text}>{props.value.toString()}</Text>
        <Image
          style={quickPickStyles.smallRocket}
          source={require('app/assets/images/lumen-rocket.png')}
        />
      </View>
    </TouchableOpacity>
  </View>
);

const quickPickStyles = StyleSheet.create({
  contain: {
    borderRadius: 200,
    alignItems: 'center',
    marginHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowColor: 'black',
        shadowOffset: {height: 0, width: 0}
      },
      android: {
        borderColor: 'rgba(0,0,0, 0.05)',
        borderWidth: 1
      }
    })
  },
  innerContain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontFamily: theme.fontRegular,
    color: theme.colorDarkBlue,
    fontSize: 24
  },
  smallRocket: {
    width: 14,
    height: 17
  }
});

const SubmitErrorMessage = props => {
  const minTransferOrBalanceError =
    !props.meetsMinTransfer || !props.meetsMinAccountBalance;

  const minTransferMessage = minTransferOrBalanceError ? (
    <Text>
      {` `}This transaction{' '}
      {!props.meetsMinTransfer
        ? 'is below the minimum transfer amount (1 Lumen)'
        : 'exceeds your available account balance (Stellar accounts have a minimum balance of 1 Lumen)'}.
    </Text>
  ) : null;

  const incomingBalanceMessage =
    (!props.meetsMinAccountBalance || props.zeroBalance) &&
    props.hasIncomingBalance ? (
      <Text>
        {` `}You have {props.incomingDisplayLumenBalance} lumen still pending.
        Please check{` `}
        <Text
          style={styles.incomingLink}
          onPress={() => {
            props.history.push('/main/activity');
          }}
        >
          activity
        </Text>
        {` `}
        to see the status of the transfers.
      </Text>
    ) : null;

  const emojiMessage =
    !minTransferOrBalanceError && !props.memoValid ? (
      <Text>
        {` `}Your message is over the max character count (28). Keep in mind,
        emojis count as 4 characters. 😡
      </Text>
    ) : null;

  if (!minTransferMessage && !incomingBalanceMessage && !emojiMessage) {
    return null;
  }

  return (
    <Text style={styles.incomingText}>
      <Text style={styles.incomingHighlight}>Note!</Text>
      {minTransferMessage}
      {incomingBalanceMessage}
      {emojiMessage}
    </Text>
  );
};

class CreatePayment extends React.Component {
  state = {quickPickItemWh: 0};

  quickPickLayout = e => {
    this.setState({quickPickItemWh: e.nativeEvent.layout.width / 4});
  };

  gte = v => this.props.lumenBalance.greaterThanOrEqualTo(v);
  lt = v => this.props.lumenBalance.lessThan(v);
  lte = v => this.props.lumenBalance.lessThanOrEqualTo(v);

  handleUpdateLumenValue = value => () => {
    Keyboard.dismiss();
    this.props.updateLumenValue(value);
  };

  maybeBlurZero = () => {
    if (this.props.lumenTransfer === '') {
      this.props.updateLumenValue('0');
    }
  };

  reviewPayment = () => this.props.goTo(2);

  render() {
    return (
      <View style={styles.contain}>
        <KeyboardScroll extraScrollHeight={150}>
          <View style={styles.mainContent}>
            <View style={styles.valuesContain}>
              <TextInput
                style={styles.valueText}
                value={this.props.lumenTransfer}
                selectionColor={theme.colorBlue}
                onChangeText={this.props.updateLumenValue}
                onBlur={this.maybeBlurZero}
                underlineColorAndroid="rgba(0,0,0,0)"
                keyboardType="numeric"
                returnKeyType="done"
                autoFocus
              />
              <Text style={styles.valueFiatText}>
                {this.props.fiatTransfer}
              </Text>
            </View>
            {this.gte(10) && (
              <View style={styles.quickPicks} onLayout={this.quickPickLayout}>
                {this.lt(100) && (
                  <QuickPick
                    value={new Big(5)}
                    wh={this.state.quickPickItemWh}
                    updateValue={this.handleUpdateLumenValue('5')}
                  />
                )}
                <QuickPick
                  value={new Big(10)}
                  wh={this.state.quickPickItemWh}
                  updateValue={this.handleUpdateLumenValue('10')}
                />
                {this.gte(20) && (
                  <QuickPick
                    value={new Big(20)}
                    wh={this.state.quickPickItemWh}
                    updateValue={this.handleUpdateLumenValue('20')}
                  />
                )}
                {this.gte(40) && (
                  <QuickPick
                    value={new Big(40)}
                    wh={this.state.quickPickItemWh}
                    updateValue={this.handleUpdateLumenValue('40')}
                  />
                )}
                {this.gte(100) && (
                  <QuickPick
                    value={new Big(80)}
                    wh={this.state.quickPickItemWh}
                    updateValue={this.handleUpdateLumenValue('80')}
                  />
                )}
              </View>
            )}
            <View style={styles.bodyContain}>
              <FormInput
                label="Memo"
                placeholder="What's it for? Emojis! 28 character max."
                height={60}
                onChangeText={this.props.updateMemo}
                value={this.props.memo}
              />
              <Button
                title="Review"
                disabled={!this.props.canSubmit}
                onPress={this.reviewPayment}
                variation="blue"
              />
              <SubmitErrorMessage {...this.props} />
            </View>
          </View>
          {this.props.userInfo}
        </KeyboardScroll>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contain: {flex: 1, backgroundColor: theme.colorCoolBg},
  valuesContain: {
    marginVertical: 10
  },
  mainContent: {backgroundColor: 'white'},
  valueText: {
    fontFamily: theme.fontRegular,
    color: theme.colorDarkBlue,
    textAlign: 'center',
    fontSize: 80
  },
  valueFiatText: {
    fontFamily: theme.fontLight,
    color: theme.colorDarkBlue,
    textAlign: 'center',
    fontSize: 40
  },
  valueTextSmall: {
    fontFamily: theme.fontLight,
    color: theme.colorDarkBlue,
    fontSize: 30,
    paddingTop: 5
  },
  slideContain: {
    paddingVertical: 20,
    paddingHorizontal: 40
  },
  bodyContain: {
    padding: 20
  },
  quickPicks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  incomingHighlight: {
    fontFamily: theme.fontRegular,
    color: theme.colorRed
  },
  incomingText: {
    marginTop: 20,
    fontSize: 15,
    fontFamily: theme.fontBodyMedium,
    color: theme.colorDarkBlue
  },
  incomingLink: {
    textDecorationLine: 'underline'
  }
});

export default compose(
  withRouter,
  connect(state => ({
    zeroBalance: selectors.selectZeroBalance(state),
    hasIncomingBalance: selectors.selectHasIncomingBalance(state),
    incomingDisplayLumenBalance: selectors.selectIncomingDisplayLumenBalance(
      state
    ),
    lumenBalance: selectors.selectAvailableLumenBalance(state)
  }))
)(CreatePayment);
