import {selectors} from 'app/core';
export const lookupFederation = value => async (dispatch, getState) => {
  const state = getState();
  if (!selectors.selectFilterMatchesFederation(state)) {
    return;
  }

  const [, server, filter] = selectors.selectFilterFederation(state);
  const federationServer = await fetch(
    `https://${server}/.well-known/stellar.toml`
  )
    .then(res => res.text())
    .then(str => str.split('FEDERATION_SERVER=')[1].replace(/["']/g, ''))
    .catch(() => null);

  if (!federationServer) {
    return;
  }

  const federationEndpoint = `${federationServer}?type=name&q=${filter}`;

  try {
    const stellarAddress =
      (await fetch(federationEndpoint).then(res => res.json())).account_id ||
      '';

    if (value === selectors.selectContactsFilter(getState())) {
      dispatch({type: 'UPDATE_FILTER_FEDERATION', payload: stellarAddress});
    }
  } catch (e) {
    // nothing
  }
};
