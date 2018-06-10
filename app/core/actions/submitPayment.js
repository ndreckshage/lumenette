import {selectors} from 'app/core';
import graphqlFetch from 'app/lib/graphqlFetch';
import * as queries from 'app/core/queries';
import {logError} from 'app/lib/logger';
import {loadStellarAccount, clearTransactionsCache} from 'app/core/actions';
import stellarEndpoint from 'app/core/lib/stellarEndpoint';
import {bridgePromise} from 'app/core/lib/bridgePromise';
import {STELLAR_NETWORK} from 'react-native-dotenv';

// @NOTE, simple to display a nice homepage update and animation
const OVERVIEW_PRICE_UPDATE_DELAY = 2000;

const recordTransaction = ({
  pendingId,
  lumenAddress,
  amountToTransfer,
  memo
}) => (dispatch, getState) => {
  const state = getState();
  const publicKey = selectors.selectPublicKey(state);
  const signedValue = selectors.selectSignedValue(state);
  const lumenRate = selectors.selectLumenRate(state);
  const preferredCurrency = selectors.selectPreferredCurrency(state);
  const preferredCurrentSymbol = selectors.selectPreferredCurrencySymbol(state);
  graphqlFetch(queries.recordTransaction, {
    pendingId,
    publicKey,
    signedValue,
    memo,
    publicKeyTo: lumenAddress,
    amount: amountToTransfer.toString(),
    fiat: `${preferredCurrentSymbol}${amountToTransfer
      .times(lumenRate)
      .toFixed(2)} ${preferredCurrency}`
  });
};

const notifyPendingTransactionFail = pendingId => async (
  dispatch,
  getState
) => {
  const state = getState();
  graphqlFetch(queries.cancelPending, {
    publicKey: selectors.selectPublicKey(state),
    signedValue: selectors.selectSignedValue(state),
    fromFailure: true,
    pendingId
  });
};

const getPushId = async () => {
  // try {
  //   const {status: notificationsStatus} = await Permissions.getAsync(
  //     Permissions.NOTIFICATIONS
  //   );
  //   let finalNotificationsStatus = notificationsStatus;
  //   if (notificationsStatus !== 'granted') {
  //     const {status: newNotificationsStatus} = await Permissions.askAsync(
  //       Permissions.NOTIFICATIONS
  //     );
  //     finalNotificationsStatus = newNotificationsStatus;
  //   }
  //
  //   return finalNotificationsStatus === 'granted'
  //     ? await Notifications.getExpoPushTokenAsync()
  //     : null;
  // } catch (e) {
  //   logError(e, {fn: 'getPushId'});
  //   return null;
  // }
};

export const submitPayment = ({
  amountToTransfer,
  memo,
  lumenAddress,
  pendingId,
  contact
}) => async (dispatch, getState) => {
  const state = getState();
  if (lumenAddress) {
    // ensure we have up to date sequence
    await dispatch(loadStellarAccount());

    const publicKey = selectors.selectPublicKey(state);
    const secretKey = selectors.selectSecretKey(state);
    const sequence = selectors.selectLumenSequence(state);
    const inflationDestination = selectors.selectInflationDestination(state);
    const hasInflationSet = selectors.selectHasMatchingInflationDestination(
      state
    );

    let hasAccount;
    try {
      hasAccount = await fetch(`${stellarEndpoint}/accounts/${lumenAddress}`)
        .then(res => res.json())
        .then(data => data.status !== 404);
    } catch (e) {
      logError(e, {fn: 'submitPayment 1'});
    }

    const amount = amountToTransfer.toString();
    const transactionToSign = {
      amount,
      sequence: sequence.toString(),
      contactPublicKey: lumenAddress,
      myPublicKey: publicKey,
      mySecretKey: secretKey,
      newAccount: !hasAccount,
      useTestNetwork: STELLAR_NETWORK === 'DEV',
      needsInflationOperation: !hasInflationSet,
      inflationDestination,
      memo: memo.slice(0, 28)
    };

    try {
      const {envelope: signedTransaction} = await bridgePromise(
        'createSignedTransaction',
        transactionToSign
      );

      return await fetch(`${stellarEndpoint}/transactions`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
        }),
        body: `tx=${encodeURIComponent(signedTransaction)}`
      })
        .then(res => res.json())
        .then(data => {
          const success = !!data.hash && !!data.ledger;
          if (!success) {
            return {success: false};
          }

          const txRecord = {amountToTransfer, lumenAddress, pendingId, memo};
          dispatch(recordTransaction(txRecord));
          dispatch(clearTransactionsCache());
          return dispatch(
            loadStellarAccount({delay: OVERVIEW_PRICE_UPDATE_DELAY})
          ).then(() => {
            return {success};
          });
        })
        .catch(e => {
          if (pendingId) {
            dispatch(notifyPendingTransactionFail(pendingId));
          }
          logError(e, {fn: 'submitPayment 2'});
          return {success: false};
        });
    } catch (e) {
      logError(e, {fn: 'submitPayment 3'});
      return {success: false};
    }
  } else {
    if (!contact || !contact.value || !contact.type) {
      return {success: false};
    }

    const lumenRate = selectors.selectLumenRate(state);
    const preferredCurrency = selectors.selectPreferredCurrency(state);
    const preferredCurrentSymbol = selectors.selectPreferredCurrencySymbol(
      state
    );

    let pushRequestId;
    try {
      pushRequestId = await getPushId();
    } catch (e) {
      logError(e, {fn: 'submitPayment getPushId'});
    }

    let args = {};
    let pendingId;
    try {
      args = {
        pushRequestId,
        publicKey: selectors.selectPublicKey(state),
        signedValue: selectors.selectSignedValue(state),
        firstName: selectors.selectFirstName(state),
        lastName: selectors.selectLastName(state),
        amount: amountToTransfer.toString(),
        type: contact.type,
        value: contact.value,
        fiat: `${preferredCurrentSymbol}${amountToTransfer
          .times(lumenRate)
          .toFixed(2)} ${preferredCurrency}`,
        memo
      };
      pendingId = (await graphqlFetch(queries.createPendingTransfer, args)).data
        .createPendingTransfer.id;
    } catch (e) {
      logError(e, {fn: 'submitPayment getPending'});
    }

    // delay to show homepage transition
    setTimeout(() => {
      dispatch({
        type: 'CREATE_PENDING_TRANSACTION',
        payload: {
          date: Date.now(),
          amount: amountToTransfer.toString(),
          name: contact.name,
          type: contact.type,
          value: contact.value,
          pendingId,
          memo
        }
      });
    }, OVERVIEW_PRICE_UPDATE_DELAY);

    return {success: true};
  }
};
