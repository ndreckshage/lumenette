import { selectors } from "app/core";
import graphqlFetch from "app/lib/graphqlFetch";
import * as queries from "app/core/queries";
import { bridgePromise } from "app/core/lib/bridgePromise";
import { logError } from "app/lib/logger";
import { loadMyKeypairLinks } from "app/core/actions";

export const updateUserInfo = ({
  firstName,
  lastName,
  phone,
  email,
  userName
}) => async (dispatch, getState) => {
  const state = getState();
  const publicKey = selectors.selectPublicKey(state);
  const signedValue = selectors.selectSignedValue(state);

  if (!firstName) firstName = selectors.selectFirstName(state);
  if (!lastName) lastName = selectors.selectLastName(state);
  if (!userName) userName = selectors.selectUserName(state);

  dispatch({
    type: "LOAD_NAME",
    payload: {
      firstName,
      lastName
    }
  });

  if (email) {
    try {
      const [hashedEmail] = (await bridgePromise("hashStrings", {
        stringsToHash: [email]
      })).hashedStrings;

      await graphqlFetch(queries.upsertPublicLink, {
        firstName,
        lastName,
        publicKey,
        signedValue,
        link: { linkType: "email", link: email, hash: hashedEmail }
      });
    } catch (e) {
      logError(e, { fn: "updateUserInfo 1" });
    }
  }

  if (phone) {
    try {
      const [hashedPhone] = (await bridgePromise("hashStrings", {
        stringsToHash: [phone]
      })).hashedStrings;

      await graphqlFetch(queries.upsertPublicLink, {
        firstName,
        lastName,
        publicKey,
        signedValue,
        link: { linkType: "phone", link: phone, hash: hashedPhone }
      });
    } catch (e) {
      logError(e, { fn: "updateUserInfo 2" });
    }
  }

  if (userName) {
    try {
      await graphqlFetch(queries.upsertPublicLink, {
        firstName,
        lastName,
        publicKey,
        signedValue,
        link: { linkType: "username", link: userName, hash: "n/a" }
      });
    } catch (e) {
      logError(e, { fn: "updateUserInfo 2" });
    }
  }

  return dispatch(loadMyKeypairLinks());
};
