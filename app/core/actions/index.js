// import {Permissions, Notifications} from 'expo';
import Contacts from "react-native-contacts";
import { Platform } from "react-native";
import TouchID from "react-native-touch-id";
import Toast from "react-native-root-toast";
import dateFormat from "date-fns/format";

import normalizeContacts from "app/core/lib/normalizeContacts";
import graphqlFetch from "app/lib/graphqlFetch";
import { logError } from "app/lib/logger";
import { selectors } from "app/core";
import * as queries from "app/core/queries";
import stellarEndpoint from "app/core/lib/stellarEndpoint";
import { bridgePromise } from "app/core/lib/bridgePromise";
import { submitPayment } from "app/core/actions/submitPayment";
import { lookupFederation } from "app/core/actions/lookupFederation";

const VALUE_TO_SIGN = "lumenette";

export const checkContactPermission = (requestPermission = false) => async (
  dispatch,
  getState
) => {
  const checkBasePermission = () =>
    new Promise(resolve => {
      // on android we have to use our custom permission screen so never rely on
      // request or play store ban!
      const permissionFn =
        requestPermission && Platform.OS === "ios"
          ? Contacts.requestPermission
          : Contacts.checkPermission;

      permissionFn((err, permission) => {
        resolve(permission === "authorized");
      });
    });

  const hasPhonePermission = await checkBasePermission();
  return Platform.OS !== "android"
    ? hasPhonePermission
    : hasPhonePermission &&
        selectors.selectHasGrantedAndroidContactPermissions(getState());
};

export const grantAndroidContactPermission = () => ({
  type: "GRANT_ANDROID_CONTACT_PERMISSION"
});

const triggerTouchId = msg => async () => {
  let authed = false;
  try {
    authed = await TouchID.authenticate(msg);
  } catch (e) {
    // do nothing
  }

  return authed;
};

export const verifyTouchId = () => async (dispatch, getState) => {
  const state = getState();
  const needsTouchId = selectors.selectNeedsTouchId(state);
  if (needsTouchId) {
    const msg = "Use TouchID to unlock Lumenette.";
    return await dispatch(triggerTouchId(msg));
  }

  return true;
};

export const toggleTouchId = shouldEnable => async (dispatch, getState) => {
  const needsTouchId = selectors.selectNeedsTouchId(getState());

  try {
    const msg = shouldEnable
      ? "Require TouchID to open the app."
      : "Remove TouchID";

    const authed = await dispatch(triggerTouchId(msg));

    if (authed) {
      dispatch({ type: "SET_TOUCH_ID", payload: shouldEnable });
    }

    return authed ? shouldEnable : needsTouchId;
  } catch (e) {
    return needsTouchId;
  }
};

export const removePinValidation = () => (dispatch, getState) => {
  const state = getState();
  const decryptedSecretKey = selectors.selectDecryptedSecretKey(state);
  const decryptedMnemonic = selectors.selectDecryptedMnemonic(state);
  if (decryptedSecretKey) {
    dispatch({
      type: "DECRYPT_SECRET_KEY_RECOVERY",
      payload: { decryptedSecretKey, decryptedMnemonic }
    });
  }
};

export const validatePin = pin => async (dispatch, getState) => {
  const state = getState();
  const encryptedSecretKey = selectors.selectRawSecretKey(state);
  const encryptedMnemonic = selectors.selectRawMnemonicString(state);
  const publicKey = selectors.selectPublicKey(state);

  try {
    const { decryptedString: decryptedSecretKey } = await bridgePromise(
      "decryptString",
      {
        encryptedString: encryptedSecretKey,
        password: pin
      }
    );

    const { decryptedString: decryptedMnemonic } = await bridgePromise(
      "decryptString",
      {
        encryptedString: encryptedMnemonic,
        password: pin
      }
    );

    const { publicKey: matchedPublicKey } = await bridgePromise(
      "loadKeypairFromSecret",
      {
        secretKey: decryptedSecretKey
      }
    );

    if (decryptedSecretKey && publicKey === matchedPublicKey) {
      dispatch({
        type: "LOAD_DECRYPTED_KEYPAIR",
        payload: { decryptedSecretKey, decryptedMnemonic }
      });
    } else {
      dispatch({ type: "MARK_FAILED_PIN_GUESS" });
    }

    return decryptedSecretKey;
  } catch (e) {
    dispatch({ type: "MARK_FAILED_PIN_GUESS" });
    return "";
  }
};

export const clearDecryptedKeypair = () => ({
  type: "CLEAR_DECRYPTED_KEYPAIR"
});

export const encryptWithPin = pin => async (dispatch, getState) => {
  const state = getState();
  const hasEncryptedSecretKey = selectors.selectHasEncryptedSecretKey(state);
  const decryptedSecretKey = selectors.selectRawSecretKey(state);
  const mnemonic = selectors.selectMnemonicString(state);
  if (hasEncryptedSecretKey) {
    return false;
  }

  try {
    const { encryptedString: encryptedSecretKey } = await bridgePromise(
      "encryptString",
      {
        decryptedString: decryptedSecretKey,
        password: pin
      }
    );

    const { encryptedString: encryptedMnemonic } = await bridgePromise(
      "encryptString",
      {
        decryptedString: mnemonic,
        password: pin
      }
    );

    if (encryptedSecretKey) {
      dispatch({
        type: "ENCRYPT_SECRET_KEY_RECOVERY",
        payload: { encryptedSecretKey, encryptedMnemonic }
      });
      return true;
    }
  } catch (e) {
    // do nothign
  }

  return false;
};

export const checkPendingTransfers = () => async (dispatch, getState) => {
  const state = getState();
  const publicKey = selectors.selectPublicKey(state);
  const signedValue = selectors.selectSignedValue(state);
  const pendingTransactions = selectors.selectPendingTransactions(state);
  const links = pendingTransactions.reduce(
    (acc, transaction) =>
      !acc.find(
        t => t.linkType === transaction.type && t.link === transaction.value
      )
        ? [...acc, { link: transaction.value, linkType: transaction.type }]
        : acc,
    []
  );

  try {
    const { hashedStrings: hashLinks } = await bridgePromise("hashStrings", {
      stringsToHash: links.map(link => link.link)
    });

    const {
      data: { publicLinks }
    } = await graphqlFetch(queries.publicLinks, {
      hashLinks,
      publicKey,
      signedValue,
      verified: true
    });

    if (publicLinks && publicLinks.length > 0) {
      publicLinks.forEach(publicLink => {
        dispatch({ type: "PROCESS_PUBLIC_LINK", payload: publicLink });
      });

      dispatch(processPendingTransactions());
    }
  } catch (e) {
    logError(e, { fn: "checkPendingTransfers" });
  }
};

let _processingPending = false;
const processPendingTransactions = () => async (dispatch, getState) => {
  if (_processingPending) {
    return;
  } else {
    _processingPending = true;
  }

  const state = getState();
  const transactions = selectors.selectPendingProcessingTransactions(state);
  const canProceed = selectors.selectSecretCanProcess(state);

  if (transactions.length && !canProceed) {
    _processingPending = false;
    dispatch({ type: "PROCESS_PENDING_PROMPT_PIN" });
    return;
  }

  for (let i = 0, l = transactions.length; i < l; i++) {
    const transaction = transactions[i];
    const payment = {
      amountToTransfer: transaction.amount,
      lumenAddress: transaction.publicKey,
      pendingId: transaction.pendingId,
      memo: transaction.memo
    };

    let success;
    try {
      success = (await dispatch(submitPayment(payment))).success;
    } catch (e) {
      logError(e, { fn: "processPendingTransactions" });
    }

    if (success) {
      dispatch({ type: "COMPLETE_PENDING", payload: transaction.date });
    } else {
      dispatch({ type: "MARK_PENDING_FAILED", payload: transaction.date });
    }
  }

  dispatch(loadLumenContacts());
  // stellar network delay? :/
  setTimeout(() => {
    dispatch(loadTransactions());
  }, 1000);

  _processingPending = false;
};

export const loadMyKeypairLinks = () => async (dispatch, getState) => {
  const state = getState();
  const publicKey = selectors.selectPublicKey(state);
  const signedValue = selectors.selectSignedValue(state);

  let keyPairData;
  try {
    const json = await graphqlFetch(queries.keyPairData, {
      publicKey,
      signedValue
    });
    keyPairData = json.data.keyPairData;
  } catch (e) {
    logError(e, { fn: "loadMyKeypairLinks" });
  }

  if (keyPairData && keyPairData.length > 0) {
    const phoneData = keyPairData.find(data => data.linkType === "phone");
    const emailData = keyPairData.find(data => data.linkType === "email");
    const usernameData = keyPairData.find(data => data.linkType === "username");

    const firstName = keyPairData[0].firstName;
    const lastName = keyPairData[0].lastName;
    const phone = phoneData ? phoneData.link : "";
    const phoneVerified = phoneData ? phoneData.verified : false;
    const email = emailData ? emailData.link : "";
    const emailVerified = emailData ? emailData.verified : false;
    const userName = usernameData ? usernameData.link : "";

    const payload = {
      phone,
      phoneVerified,
      email,
      emailVerified,
      firstName,
      lastName,
      userName
    };

    dispatch({ type: "LOAD_MY_KEYPAIR_LINKS", payload });
    return payload;
  }

  return {};
};

export const markIntroComplete = () => dispatch =>
  dispatch({ type: "MARK_INTRO_COMPLETE" });

export const markOnboardingComplete = () => dispatch =>
  dispatch({ type: "MARK_ONBOARDING_COMPLETE" });

const loadCoin = ({ dispatch, actionType, preferredCurrency, coin }) =>
  fetch(
    `https://api.coinmarketcap.com/v1/ticker/${coin}/?convert=${preferredCurrency}`
  )
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: actionType,
        payload: {
          rateType: preferredCurrency,
          rate: data[0][`price_${preferredCurrency.toLowerCase()}`],
          percentChange24: data[0].percent_change_24h,
          marketCap: data[0].market_cap_usd,
          rank: data[0].rank,
          date: dateFormat(new Date(), "h:mm A on MMMM Do, GGGG")
        }
      });
    });

export const loadLumenPrice = () => async (dispatch, getState) => {
  const preferredCurrency = selectors.selectPreferredCurrency(getState());
  try {
    const opts = { dispatch, preferredCurrency };

    await loadCoin({
      ...opts,
      coin: "stellar",
      actionType: "LOAD_LUMEN_PRICE"
    });

    loadCoin({ ...opts, coin: "bitcoin", actionType: "LOAD_BITCOIN_PRICE" });
    loadCoin({ ...opts, coin: "litecoin", actionType: "LOAD_LITECOIN_PRICE" });
    loadCoin({ ...opts, coin: "ethereum", actionType: "LOAD_ETHEREUM_PRICE" });
    loadCoin({ ...opts, coin: "mobius", actionType: "LOAD_MOBIUS_PRICE" });
  } catch (e) {
    logError(e, { fn: "loadLumenPrice" });
  }
};

export const updateCurrency = currency => dispatch => {
  dispatch({ type: "UPDATE_CURRENCY", payload: currency });
  dispatch(loadLumenPrice());
};

let _loadingContacts = false;
export const loadContacts = () => async (dispatch, getState) => {
  const grantedPermission = await dispatch(checkContactPermission());
  if (!grantedPermission) return;

  if (_loadingContacts) {
    return;
  } else {
    _loadingContacts = true;
  }

  const state = getState();
  const myPhone = selectors.selectPhone(state);
  const myEmail = selectors.selectEmail(state);

  Contacts.getAll((err, contacts) => {
    _loadingContacts = false;
    if (!err) {
      const normalizedContacts = normalizeContacts(contacts, myPhone, myEmail);
      dispatch({ type: "CONTACTS_LOAD", payload: normalizedContacts });
      dispatch(loadLumenContacts());
    }
  });
};

let _lastFetchedLumenContacts = null;
export const loadLumenContacts = ({ cache } = {}) => async (
  dispatch,
  getState
) => {
  if (
    cache &&
    _lastFetchedLumenContacts &&
    Date.now() - _lastFetchedLumenContacts <= cache
  ) {
    return;
  }

  const state = getState();
  const publicKey = selectors.selectPublicKey(state);
  const signedValue = selectors.selectSignedValue(state);
  const links = selectors.selectContactsInputLinks(state);

  const { hashedStrings: hashLinks } = await bridgePromise("hashStrings", {
    stringsToHash: links.map(link => link.link)
  });

  try {
    const {
      data: { publicLinks }
    } = await graphqlFetch(queries.publicLinks, {
      hashLinks,
      publicKey,
      signedValue,
      verified: true
    });

    _lastFetchedLumenContacts = Date.now();
    dispatch({ type: "LOAD_LUMEN_CONTACTS", payload: publicLinks });
  } catch (e) {
    logError(e, { fn: "loadLumenContacts" });
  }
};

export const clearContactsFilter = () => ({
  type: "UPDATE_CONTACTS_FILTER",
  payload: ""
});

export const handleContactsFilter = value => (dispatch, getState) => {
  dispatch({ type: "UPDATE_CONTACTS_FILTER", payload: value });
  const federation = selectors.selectFilterMatchesFederation(getState());
  if (federation) {
    dispatch(lookupFederation(value));
  }
};

export const loadStellarAccount = ({ delay } = {}) => async (
  dispatch,
  getState
) => {
  const state = getState();
  const previousBalance = selectors.selectAvailableLumenBalance(state);
  const pk = selectors.selectPublicKey(state);
  try {
    await fetch(`${stellarEndpoint}/accounts/${pk}`)
      .then(res => res.json())
      .then(data => {
        const {
          balances,
          sequence,
          inflation_destination: inflationDestination
        } = data;
        const { balance } = balances
          ? balances.find(a => a.asset_type === "native") || { balance: 0 }
          : { balance: 0 };

        const { balance: bitcoinBalance } = balances
          ? balances.find(
              a => a.asset_type === "credit_alphanum4" && a.asset_code === "BTC"
            ) || { balance: 0 }
          : { balance: 0 };

        const { balance: ethereumBalance } = balances
          ? balances.find(
              a => a.asset_type === "credit_alphanum4" && a.asset_code === "ETH"
            ) || { balance: 0 }
          : { balance: 0 };

        const { balance: litecoinBalance } = balances
          ? balances.find(
              a => a.asset_type === "credit_alphanum4" && a.asset_code === "LTC"
            ) || { balance: 0 }
          : { balance: 0 };

        const { balance: mobiusBalance } = balances
          ? balances.find(
              a =>
                a.asset_type === "credit_alphanum4" && a.asset_code === "MOBI"
            ) || { balance: 0 }
          : { balance: 0 };

        const maybeClearTransactions = () => {
          if (
            selectors.selectAvailableLumenBalance(getState()) !==
            previousBalance
          ) {
            dispatch(clearTransactionsCache());
          }
        };

        dispatch({
          type: "LOAD_OTHER_BALANCES",
          payload: {
            bitcoinBalance,
            ethereumBalance,
            litecoinBalance,
            mobiusBalance
          }
        });

        if (delay) {
          setTimeout(() => {
            dispatch({
              type: "LOAD_STELLAR_ACCOUNT",
              payload: { balance, sequence, inflationDestination }
            });
            maybeClearTransactions();
          }, delay);
        } else {
          dispatch({
            type: "LOAD_STELLAR_ACCOUNT",
            payload: { balance, sequence, inflationDestination }
          });
          maybeClearTransactions();
        }
      });
  } catch (e) {
    logError(e, { fn: "loadStellarAccount" });
  }
};

export const loadBalanceAndRates = () => dispatch =>
  Promise.all([
    dispatch(loadLumenPrice()),
    dispatch(loadStellarAccount()),
    dispatch(loadIncomingPending())
  ]);

export const getLumenAddress = contact => async (dispatch, getState) => {
  if (!contact || !contact.value || !contact.type) {
    return null;
  }

  const state = getState();
  const publicKey = selectors.selectPublicKey(state);
  const signedValue = selectors.selectSignedValue(state);

  try {
    const { hashedStrings: hashLinks } = await bridgePromise("hashStrings", {
      stringsToHash: [contact.value]
    });

    const {
      data: { publicLinks }
    } = await graphqlFetch(queries.publicLinks, {
      hashLinks,
      publicKey,
      signedValue,
      verified: true
    });

    return publicLinks.length > 0 ? publicLinks[0] : null;
  } catch (e) {
    logError(e, { fn: "getLumenAddress" });
    return null;
  }
};

export const getAndRecordPushId = () => async (/* dispatch, getState */) => {
  // const state = getState();
  // const publicKey = selectors.selectPublicKey(state);
  // const signedValue = selectors.selectSignedValue(state);
  // let pushRequestId = selectors.selectPushRequestId(state);
  // if (!pushRequestId) {
  //   try {
  //     pushRequestId = await getPushId();
  //     if (pushRequestId) {
  //       dispatch({type: 'SET_PUSH_REQUEST_ID', payload: pushRequestId});
  //       await graphqlFetch(queries.recordPushRequestId, {
  //         publicKey,
  //         signedValue,
  //         pushRequestId
  //       });
  //     }
  //   } catch (e) {
  //     logError(e, {fn: 'submitPayment getPushId'});
  //   }
  // }
};

export const signValue = (value = VALUE_TO_SIGN) => async (
  dispatch,
  getState
) => {
  const state = getState();
  try {
    const secretKey = selectors.selectSecretKey(state);
    const { signedValue } = await bridgePromise("createSignedValue", {
      secretKey,
      value
    });

    dispatch({ type: "LOAD_SIGNED_VALUE", payload: signedValue });
  } catch (e) {
    logError(e, { fn: "signValue" });
  }
};

const loadIncomingPending = () => async (dispatch, getState) => {
  const state = getState();
  const incomingPending = (await graphqlFetch(queries.incomingPending, {
    publicKey: selectors.selectPublicKey(state),
    signedValue: selectors.selectSignedValue(state)
  })).data.incomingPending;

  dispatch({ type: "LOAD_INCOMING_PENDING", payload: incomingPending });
};

let _lastFetchedTransactions = null;
let _lastTransactionCursor = "";
export const loadTransactions = ({ cache, useCursor } = {}) => async (
  dispatch,
  getState
) => {
  if (!useCursor) {
    dispatch(loadIncomingPending());
  }

  if (
    cache &&
    _lastFetchedTransactions &&
    Date.now() - _lastFetchedTransactions <= cache
  ) {
    return;
  }

  const state = getState();
  const pk = selectors.selectPublicKey(state);
  const pagingToken = selectors.selectTransactionCursor(state);

  const cursorNoToken = useCursor && !pagingToken;
  const alreadyFetchedToken =
    useCursor && pagingToken === _lastTransactionCursor;

  _lastTransactionCursor = useCursor
    ? pagingToken
      ? pagingToken
      : _lastTransactionCursor
    : "";

  if (cursorNoToken || alreadyFetchedToken) {
    return;
  }

  const cursor = useCursor ? (pagingToken ? `&cursor=${pagingToken}` : "") : "";

  const limit = 10;
  const search = `?order=desc&limit=${limit}${cursor}`;
  const endpoint = `${stellarEndpoint}/accounts/${pk}/transactions${search}`;
  let transactions = [];
  try {
    transactions = await fetch(endpoint)
      .then(res => res.json())
      .then(data =>
        ((data._embedded || {}).records || []).map(record => ({
          id: record.id,
          memo: record.memo || null,
          pagingToken: record.paging_token,
          createdAt: record.created_at
        }))
      );
  } catch (e) {
    logError(e, { fn: "loadTransactions transactions" });
  }

  let operations = [];
  try {
    operations = await Promise.all(
      transactions.map(transaction =>
        fetch(
          `${stellarEndpoint}/transactions/${transaction.id}/operations`
        ).then(res => res.json())
      )
    );
  } catch (e) {
    logError(e, { fn: "loadTransactions operations" });
  }

  const mappedTransactions = transactions
    .map((transaction, ndx) => {
      const operation = operations[ndx]._embedded.records.find(
        op => op.type === "payment" || op.type === "create_account"
      ) || { amount: 0, source_account: "", to: "" };

      return {
        ...transaction,
        amount: operation.amount || operation.starting_balance,
        from: operation.source_account,
        to: operation.to || operation.account
      };
    })
    .filter(op => op.amount && parseFloat(op.amount, 10) >= 0.01);

  _lastFetchedTransactions = Date.now();
  dispatch({ type: "LOAD_TRANSACTIONS", payload: mappedTransactions });
};

export const clearTransactionsCache = () => () => {
  _lastFetchedTransactions = null;
};

export const cancelPending = dateId => async (dispatch, getState) => {
  const state = getState();
  const publicKey = selectors.selectPublicKey(state);
  const signedValue = selectors.selectSignedValue(state);
  const pending = state.pendingTransactions[dateId];
  await graphqlFetch(queries.cancelPending, {
    publicKey,
    signedValue,
    pendingId: pending.pendingId
  });
  dispatch({ type: "CANCEL_PENDING", payload: dateId });
};

export const verifyPhoneNumber = code => async (dispatch, getState) => {
  const state = getState();
  const publicKey = selectors.selectPublicKey(state);

  try {
    const json = await graphqlFetch(queries.verifyPhoneNumber, {
      code,
      publicKey
    });

    dispatch({
      type: "UPDATE_PHONE_VERIFICATION",
      payload: json.data.verifyPhone
    });
    return json.data.verifyPhone;
  } catch (e) {
    logError(e, { fn: "verifyPhoneNumber" });
    return false;
  }
};

export const verifyEmailAddress = code => async (dispatch, getState) => {
  const state = getState();
  const publicKey = selectors.selectPublicKey(state);

  try {
    const json = await graphqlFetch(queries.verifyEmailAddress, {
      code,
      publicKey
    });

    dispatch({
      type: "UPDATE_EMAIL_VERIFICATION",
      payload: json.data.verifyEmail
    });
    return json.data.verifyEmail;
  } catch (e) {
    logError(e, { fn: "verifyEmailAddress" });
    return false;
  }
};

export const resendVerification = linkType => async (dispatch, getState) => {
  const state = getState();
  const publicKey = selectors.selectPublicKey(state);
  const signedValue = selectors.selectSignedValue(state);

  try {
    await graphqlFetch(queries.resendVerification, {
      publicKey,
      signedValue,
      linkType
    });
    Toast.show("Resent!", {
      position: Toast.positions.CENTER
    });
  } catch (e) {
    Toast.show("Failed to Resend", {
      position: Toast.positions.CENTER
    });
    logError(e, { fn: "resendVerification" });
  }
};

export const grantBetaAccess = () => ({ type: "GRANT_BETA_ACCESS" });

export const checkMaintenance = () => async () => {
  const {
    data: { maintenanceMode }
  } = await graphqlFetch(queries.checkMaintenance);

  return maintenanceMode;
};

export const setMaintenanceMode = payload => ({
  type: "SET_MAINTENANCE_MODE",
  payload
});

export const confirmKeyBackup = () => ({ type: "CONFIRM_KEY_BACKUP" });

export const addFavorite = payload => ({
  type: "ADD_FAVORITE",
  payload: { ...payload, id: Date.now() }
});
export const removeFavorite = payload => ({ type: "REMOVE_FAVORITE", payload });
export const editFavorite = payload => ({ type: "EDIT_FAVORITE", payload });
