import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import {FormInput, Button} from 'app/components/ui';
import theme from 'app/lib/theme';

class ReviewPayment extends React.Component {
  back = () => this.props.goTo(1);

  render() {
    if (this.props.submittingPayment) {
      return (
        <View style={reviewStyles.submittingContain}>
          <ActivityIndicator size="large" color={theme.colorBlue} />
          <Text style={reviewStyles.submittingPayment}>Submitting Payment</Text>
          <Text style={reviewStyles.submittingMoneyWings}>💸</Text>
        </View>
      );
    }

    if (this.props.submittedPayment) {
      return (
        <View style={reviewStyles.submittingContain}>
          <View style={reviewStyles.submittingContain}>
            <Text style={reviewStyles.submittedTextWrap}>
              {this.props.paymentSuccess ? (
                <Text style={reviewStyles.submittedTextGreen}>
                  Payment Success!
                </Text>
              ) : (
                <Text style={reviewStyles.submittedTextRed}>
                  Payment Failure.
                </Text>
              )}
            </Text>
          </View>
          <View style={reviewStyles.dismissButton}>
            <Button
              title="Dismiss"
              onPress={
                this.props.paymentSuccess ? this.props.goHome : this.back
              }
            />
          </View>
        </View>
      );
    }

    return (
      <View style={reviewStyles.contain}>
        <ScrollView>
          <View style={reviewStyles.content}>
            <View style={reviewStyles.valuesContain}>
              <Text style={reviewStyles.valueText}>
                {this.props.lumenTransfer}
              </Text>
              <Text style={reviewStyles.valueFiatText}>
                {this.props.fiatTransfer}
              </Text>
            </View>
            {!!this.props.memo && (
              <FormInput
                label="Memo"
                editable={false}
                multiline
                value={this.props.memo}
              />
            )}
            <Button
              title="Pay"
              onPress={this.props.submitPayment}
              variation="blue"
              disabled={!this.props.canSubmit}
            />
          </View>
          {this.props.userInfo}
        </ScrollView>
      </View>
    );
  }
}

const reviewStyles = StyleSheet.create({
  contain: {flex: 1, backgroundColor: theme.colorCoolBg},
  content: {padding: 20, backgroundColor: 'white'},
  valuesContain: {
    marginVertical: 20
  },
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
  submittingContain: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  submittingPayment: {
    color: theme.colorBlue,
    fontSize: 15,
    fontFamily: theme.fontRegular,
    marginTop: 10
  },
  submittingMoneyWings: {fontSize: 50, marginTop: 10},
  submittedTextWrap: {
    fontFamily: theme.fontRegular,
    fontSize: 24
  },
  submittedTextGreen: {color: theme.colorGreen},
  submittedTextRed: {color: theme.colorRed},
  dismissButton: {marginBottom: 20}
});

export default ReviewPayment;
