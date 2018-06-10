import React from 'react';
import {Modal} from 'react-native';
import {compose} from 'redux';
import Big from 'bignumber.js';
import {withRouter} from 'react-router-native';
import Header from 'app/components/transfer/ModalHeader';
import UserInfo from 'app/components/transfer/UserInfo';
import CreatePayment from 'app/components/transfer/CreatePayment';
import ReviewPayment from 'app/components/transfer/ReviewPayment';
import {StatusBar, RouteTransition} from 'app/components/ui';
import {selectors, connect, actions} from 'app/core';
import {submitPayment} from 'app/core/actions/submitPayment';
import theme from 'app/lib/theme';

const MIN_TRANSFER_AND_BALANCE = 1;
const BASE_FEE = new Big('0.00001');
const INFLATION_FEE = new Big('0.00002');

class TransferModalLayout extends React.Component {
  state = {
    amountToTransfer: new Big(0),
    amountToTransferInput: '',
    memo: '',
    increment: false,
    transition: false,
    matchedLumenAddress: null,
    loadedMatch: false,
    submittingPayment: false,
    submittedPayment: false,
    paymentSuccess: false,
    slide: 1
  };

  componentDidMount() {
    if (this.props.filterMatchType === 'lumen') {
      this.setState({
        matchedLumenAddress: this.props.normalizedContactsFilter,
        loadedMatch: true
      });
      return;
    } else if (this.props.filterMatchType === 'federation') {
      this.setState({
        matchedLumenAddress: this.props.federationAddress,
        loadedMatch: true
      });
      return;
    }

    const contact = this.props.contact
      ? this.props.contact
      : {
          type: this.props.filterMatchType,
          displayValue: this.props.contactsFilter,
          value: this.props.normalizedContactsFilter
        };

    this.props.getLumenAddress(contact).then(address => {
      if (address) {
        this.setState({
          matchedLumenAddress: address.publicKey,
          loadedMatch: true
        });
      } else {
        this.setState({matchedLumenAddress: null, loadedMatch: true});
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.slide !== this.state.slide && !this.state.transition) {
      this.setState({transition: true});
    } else if (prevState.slide === this.state.slide && this.state.transition) {
      this.setState({transition: false});
    }
  }

  goTo = slide => this.setState({slide, increment: slide === 2});
  updateLumenValue = value => {
    // handle , for french separator
    const [, decimals] = value.split(/\.|,/);
    if (decimals && decimals.length > 7) {
      return;
    }

    try {
      const amountToTransfer = new Big(value.replace(',', '.') || 0);
      this.setState({amountToTransferInput: value, amountToTransfer});
    } catch (e) {
      // bad input, not really important to do anything about, just dont allow update
    }
  };
  updateMemo = value => this.setState({memo: value});

  trimmedMemo = () => this.state.memo.trim();

  submitPayment = async () => {
    this.setState({submittingPayment: true});
    const {success} = await this.props.submitPayment({
      amountToTransfer: this.state.amountToTransfer,
      lumenAddress: this.state.matchedLumenAddress,
      memo: this.trimmedMemo(),
      contact: this.props.contact
        ? this.props.contact
        : {
            type: this.props.filterMatchType,
            displayValue: this.props.contactsFilter,
            value: this.props.normalizedContactsFilter
          }
    });

    this.setState({
      submittingPayment: false,
      submittedPayment: true,
      paymentSuccess: success
    });

    if (success) {
      setTimeout(this.goHome, 1000);
    }
  };

  goHome = () => this.props.history.push('/main', {transition: false});
  close = () => this.props.close();
  back = () => this.goTo(1);

  render() {
    const fiatTransfer =
      this.props.preferredCurrency +
      this.state.amountToTransfer.times(this.props.lumenRate).toFixed(2);

    const meetsMinTransfer = this.state.amountToTransfer.greaterThanOrEqualTo(
      MIN_TRANSFER_AND_BALANCE
    );

    const meetsMinAccountBalance = this.state.amountToTransfer
      .plus(MIN_TRANSFER_AND_BALANCE)
      .plus(this.props.hasMatchingInflation ? BASE_FEE : INFLATION_FEE)
      .lessThanOrEqualTo(this.props.lumenBalance);

    const MAX_BYTES = 28;
    const memo = this.state.memo;
    const trimmedMemo = this.trimmedMemo();
    const memoValid =
      encodeURI(trimmedMemo).split(/%..|./).length - 1 <= MAX_BYTES;
    const canSubmit = meetsMinTransfer && meetsMinAccountBalance && memoValid;

    const userInfo = (
      <UserInfo
        contact={this.props.contact}
        contactsFilter={this.props.contactsFilter}
        normalizedContactsFilter={this.props.normalizedContactsFilter}
        filterMatchType={this.props.filterMatchType}
        matchedLumenAddress={this.state.matchedLumenAddress}
      />
    );

    return (
      <Modal animationType="slide" onRequestClose={this.props.close}>
        <StatusBar backgroundColor={theme.colorBlue} barStyle="light-content" />
        <Header
          close={this.state.slide === 1 ? this.close : undefined}
          back={
            this.state.slide === 2 &&
            !this.state.submittingPayment &&
            !this.state.submittedPayment
              ? this.back
              : undefined
          }
          title={this.state.slide === 1 ? 'Pay' : 'Review'}
          contactsFilter={this.props.contactsFilter}
          filterMatchType={this.props.filterMatchType}
          contact={this.props.contact}
        />
        <RouteTransition
          increment={this.state.increment}
          transition={this.state.transition}
        >
          {this.state.slide === 1 ? (
            <CreatePayment
              lumenTransfer={this.state.amountToTransferInput}
              fiatTransfer={fiatTransfer}
              memo={memo}
              canSubmit={canSubmit}
              updateLumenValue={this.updateLumenValue}
              updateMemo={this.updateMemo}
              loadedMatch={this.state.loadedMatch}
              goTo={this.goTo}
              userInfo={userInfo}
              memoValid={memoValid}
              meetsMinTransfer={
                // dont show warning if default 0, implied
                meetsMinTransfer || this.state.amountToTransfer.isZero()
              }
              meetsMinAccountBalance={meetsMinAccountBalance}
            />
          ) : (
            <ReviewPayment
              lumenTransfer={this.state.amountToTransfer.toString()}
              fiatTransfer={fiatTransfer}
              canSubmit={canSubmit}
              submitPayment={this.submitPayment}
              memo={memo}
              loadedMatch={this.state.loadedMatch}
              submittingPayment={this.state.submittingPayment}
              submittedPayment={this.state.submittedPayment}
              paymentSuccess={this.state.paymentSuccess}
              goHome={this.goHome}
              goTo={this.goTo}
              userInfo={userInfo}
            />
          )}
        </RouteTransition>
      </Modal>
    );
  }
}

export default compose(
  withRouter,
  connect(
    state => ({
      lumenRate: selectors.selectLumenRate(state),
      lumenDisplayBalance: selectors.selectLumenDisplayBalance(state),
      preferredCurrency: selectors.selectPreferredCurrencySymbol(state),
      lumenBalance: selectors.selectAvailableLumenBalance(state),
      contactsFilter: selectors.selectContactsFilter(state),
      normalizedContactsFilter: selectors.selectNormalizedContactsFilter(state),
      federationAddress: selectors.selectFilterFederationAddress(state),
      hasMatchingInflation: selectors.selectHasMatchingInflationDestination(
        state
      ),
      filterMatchType: selectors.selectFilterMatchType(state)
    }),
    {
      getLumenAddress: actions.getLumenAddress,
      submitPayment
    }
  )
)(TransferModalLayout);
