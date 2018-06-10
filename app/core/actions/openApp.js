import graphqlFetch from "app/lib/graphqlFetch";
import { logError } from "app/lib/logger";
import { selectors, actions } from "app/core";
import { bridgePromise } from "app/core/lib/bridgePromise";
import * as queries from "app/core/queries";

export const openApp = () => async (dispatch, getState) => {
  let state = getState();
  const publicKey = selectors.selectPublicKey(state);
  const secretKey = selectors.selectRawSecretKey(state);

  try {
    if (!publicKey || !secretKey) {
      await dispatch(generateKeypair());
      await dispatch(actions.signValue());
    }
  } catch (e) {
    logError(e, { fn: "openApp 1" });
  }

  await dispatch(refreshApp());

  const grantedPermission = await dispatch(actions.checkContactPermission());
  if (grantedPermission) {
    dispatch(actions.loadContacts());
  }
};

export const refreshApp = () => async dispatch => {
  try {
    await dispatch(checkBeta());
    await dispatch(getInflationDestination());
    await dispatch(actions.loadMyKeypairLinks());
    await dispatch(actions.loadBalanceAndRates());
    await dispatch(actions.checkPendingTransfers());
  } catch (e) {
    logError(e, { fn: "refresh app" });
  }
};

const generateKeypair = () => dispatch =>
  bridgePromise("generateKeypair").then(data => {
    const { publicKey, secretKey, mnemonic } = data;
    dispatch({
      type: "LOAD_KEYPAIR",
      payload: { publicKey, secretKey, mnemonic }
    });
  });

const getInflationDestination = () => async dispatch => {
  try {
    const inflationDestination = (await graphqlFetch(
      queries.inflationDestination
    )).data.inflationDestination;
    dispatch({
      type: "SET_INFLATION_DESTINATION",
      payload: inflationDestination
    });
  } catch (e) {
    logError(e, { fn: "inflationDestination" });
  }
};

const checkBeta = () => async (dispatch, getState) => {
  const state = getState();
  if (!selectors.selectNeedsBetaRequest(state)) {
    return;
  }

  try {
    const { data: { betaInfo } } = await graphqlFetch(queries.betaInfo);
    dispatch({ type: "LOAD_BETA_INFO", payload: betaInfo });
  } catch (e) {
    logError(e, { fn: "checkBeta" });
  }
};
