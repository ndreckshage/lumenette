import graphqlFetch from "app/lib/graphqlFetch";
import { selectors, actions } from "app/core";
import { openApp } from "app/core/actions/openApp";
import { bridgePromise } from "app/core/lib/bridgePromise";
import * as queries from "app/core/queries";

export const replaceSecretKey = secretKey => async dispatch => {
  const valid = await dispatch(loadKeypairFromSecret(secretKey));
  if (valid) {
    await dispatch(actions.signValue());
    dispatch(openApp());
    return true;
  }

  return false;
};

export const replaceSecretKeyWithMnemonic = mnemonic => async dispatch => {
  const valid = await dispatch(loadKeypairFromMnemonic(mnemonic));
  if (valid) {
    await dispatch(actions.signValue());
    dispatch(openApp());
    return true;
  }

  return false;
};

export const deleteAccount = () => (dispatch, getState) => {
  const state = getState();
  const publicKey = selectors.selectPublicKey(state);
  const signedValue = selectors.selectSignedValue(state);
  graphqlFetch(queries.deleteAccount, {
    publicKey,
    signedValue
  });
  dispatch({ type: "DANGER_WIPE_STATE" });
  dispatch(openApp());
};

const loadKeypairFromMnemonic = mnemonic => dispatch =>
  bridgePromise("loadKeypairFromMnemonic", {
    mnemonic
  })
    .then(data => {
      const { publicKey, secretKey } = data;
      dispatch({
        type: "LOAD_KEYPAIR",
        payload: { publicKey, secretKey, mnemonic }
      });
      return true;
    })
    .catch(() => {
      return false;
    });

const loadKeypairFromSecret = secretKey => dispatch =>
  bridgePromise("loadKeypairFromSecret", {
    secretKey
  })
    .then(data => {
      const { publicKey, secretKey } = data;
      dispatch({ type: "LOAD_KEYPAIR", payload: { publicKey, secretKey } });
      return true;
    })
    .catch(() => {
      return false;
    });
