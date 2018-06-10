import { combineReducers } from "redux";
import { getGenericPassword, setGenericPassword } from "react-native-keychain";
import shallowequal from "shallowequal";
import DeviceInfo from "react-native-device-info";
// import {logError} from 'app/lib/logger';

const bundleId = DeviceInfo.getBundleId();

const keysToSync = [
  "appFlow",
  "keypair",
  "favorites",
  "security",
  "name",
  "contacts",
  "lumenContacts",
  "preferredCurrency",
  "pendingTransactions"
];

const withNamespace = k => `${bundleId}.${k}`;
const keyChainSet = (k, v) =>
  setGenericPassword("__doesnt_matter__", v, withNamespace(k));
const keyChainGet = k =>
  getGenericPassword(withNamespace(k)).then(
    credentials => credentials.password
  );

export const loadInitialState = async () => {
  const storedData = {};
  for (let i = 0, l = keysToSync.length; i < l; i++) {
    const key = keysToSync[i];
    const value = await keyChainGet(key);
    if (value) {
      storedData[key] = JSON.parse(value);
    }
  }

  return {
    appFlow: storedData.appFlow || {},
    keypair: storedData.keypair || {},
    protectedKeypair: {},
    keypairLinks: {},
    security: storedData.security || {},
    favorites: storedData.favorites || {},
    name: storedData.name || {},
    contacts: storedData.contacts || [],
    lumenContacts: storedData.lumenContacts || [],
    contactsFilter: "",
    filterFederationAddress: "",
    inflationDestination: "",
    preferredCurrency: storedData.preferredCurrency || "",
    pendingTransactions: storedData.pendingTransactions || [],
    incomingPendingTransactions: [],
    transactions: {},
    lumenPrice: {},
    stellarAccount: {},
    maintenanceMode: false
  };
};

const contacts = (state = [], action) =>
  action.type === "CONTACTS_LOAD" ? action.payload : state;

const inflationDestination = (state = "", action) =>
  action.type === "SET_INFLATION_DESTINATION" ? action.payload : state;

const lumenContacts = (state = [], action) =>
  action.type === "LOAD_LUMEN_CONTACTS" ? action.payload : state;

const contactsFilter = (state = "", action) =>
  action.type === "UPDATE_CONTACTS_FILTER" ? action.payload : state;

const filterFederationAddress = (state = "", action) => {
  switch (action.type) {
    case "UPDATE_FILTER_FEDERATION":
      return action.payload;

    case "UPDATE_CONTACTS_FILTER":
      return "";

    default:
      return state;
  }
};

const lumenPrice = (state = {}, action) =>
  action.type === "LOAD_LUMEN_PRICE" ? action.payload : state;

const bitcoinPrice = (state = {}, action) =>
  action.type === "LOAD_BITCOIN_PRICE" ? action.payload : state;

const ethereumPrice = (state = {}, action) =>
  action.type === "LOAD_ETHEREUM_PRICE" ? action.payload : state;

const litecoinPrice = (state = {}, action) =>
  action.type === "LOAD_LITECOIN_PRICE" ? action.payload : state;

const mobiusPrice = (state = {}, action) =>
  action.type === "LOAD_MOBIUS_PRICE" ? action.payload : state;

const preferredCurrency = (state = "", action) =>
  action.type === "UPDATE_CURRENCY" ? action.payload : state;

const otherBalances = (state = {}, action) =>
  action.type === "LOAD_OTHER_BALANCES" ? action.payload : state;

const stellarAccount = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_STELLAR_ACCOUNT":
      return {
        ...state,
        balance: action.payload.balance,
        sequence: action.payload.sequence,
        inflationDestination: action.payload.inflationDestination
      };

    default:
      return state;
  }
};

const appFlow = (state = {}, action) => {
  switch (action.type) {
    case "GRANT_ANDROID_CONTACT_PERMISSION":
      return { ...state, hasGrantedAndroidContactPermission: true };

    case "MARK_INTRO_COMPLETE":
      return { ...state, hasCompletedIntro: true };

    case "MARK_ONBOARDING_COMPLETE":
      return { ...state, hasCompletedOnboarding: true };

    case "GRANT_BETA_ACCESS":
      return { ...state, betaAccess: true };

    case "LOAD_BETA_INFO":
      return { ...state, betaInfo: action.payload };

    case "CONFIRM_KEY_BACKUP":
      return { ...state, backedUpKeysOrWords: true };

    default:
      return state;
  }
};

const keypair = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_KEYPAIR":
      return {
        ...state,
        publicKey: action.payload.publicKey,
        secretKey: action.payload.secretKey,
        mnemonic: action.payload.mnemonic
      };

    case "LOAD_SIGNED_VALUE":
      return { ...state, signedValue: action.payload };

    case "ENCRYPT_SECRET_KEY_RECOVERY":
      return {
        ...state,
        secretKey: action.payload.encryptedSecretKey,
        mnemonic: action.payload.encryptedMnemonic
      };

    case "DECRYPT_SECRET_KEY_RECOVERY":
      return {
        ...state,
        secretKey: action.payload.decryptedSecretKey,
        mnemonic: action.payload.decryptedMnemonic
      };

    case "SET_PUSH_REQUEST_ID":
      return { ...state, pushRequestId: action.payload };

    default:
      return state;
  }
};

const protectedKeypair = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_DECRYPTED_KEYPAIR":
      return {
        ...state,
        decryptedSecretKey: action.payload.decryptedSecretKey,
        decryptedMnemonic: action.payload.decryptedMnemonic,
        failedGuesses: 0,
        processPendingPromptPin: 0
      };

    case "MARK_FAILED_PIN_GUESS":
      return { ...state, failedGuesses: (state.failedGuesses || 0) + 1 };

    case "CLEAR_DECRYPTED_KEYPAIR":
      return {
        ...state,
        decryptedSecretKey: "",
        decryptedMnemonic: "",
        failedGuesses: 0
      };

    case "PROCESS_PENDING_PROMPT_PIN":
      return {
        ...state,
        processPendingPromptPin: (state.processPendingPromptPin || 0) + 1
      };

    default:
      return state;
  }
};

const keypairLinks = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_MY_KEYPAIR_LINKS":
      return {
        ...state,
        phone: action.payload.phone,
        phoneVerified: action.payload.phoneVerified,
        email: action.payload.email,
        emailVerified: action.payload.emailVerified,
        userName: action.payload.userName
      };

    case "UPDATE_PHONE_VERIFICATION":
      return { ...state, phoneVerified: action.payload };

    case "UPDATE_EMAIL_VERIFICATION":
      return { ...state, emailVerified: action.payload };

    default:
      return state;
  }
};

const name = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_NAME":
    case "LOAD_MY_KEYPAIR_LINKS":
      return {
        ...state,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName
      };

    default:
      return state;
  }
};

export const PENDING_STATUS = {
  NEW: 0,
  FAILED: 1,
  PROCESSING: 2
  // no complete .. real transactions on stellar network
};

const pendingTransactions = (state = {}, action) => {
  switch (action.type) {
    case "CREATE_PENDING_TRANSACTION":
      return {
        ...state,
        [`${action.payload.date}`]: {
          ...action.payload,
          status: PENDING_STATUS.NEW
        }
      };

    case "PROCESS_PUBLIC_LINK": {
      const transactions = Object.keys(state).filter(
        key =>
          state[key].type === action.payload.linkType &&
          state[key].value === action.payload.link
      );

      return transactions.reduce((acc, key) => {
        return {
          ...acc,
          [key]: {
            ...acc[key],
            status: PENDING_STATUS.PROCESSING,
            publicKey: action.payload.publicKey
          }
        };
      }, state);
    }

    case "MARK_PENDING_FAILED": {
      const key = `${action.payload}`;
      return {
        ...state,
        [key]: {
          ...state[key],
          status: PENDING_STATUS.FAILED
        }
      };
    }

    case "CANCEL_PENDING":
    case "COMPLETE_PENDING": {
      const { [`${action.payload}`]: omit, ...update } = state;
      return update;
    }

    default:
      return state;
  }
};

const transactions = (state = {}, action) => {
  switch (action.type) {
    case "LOAD_TRANSACTIONS":
      return action.payload.reduce(
        (acc, transaction) => ({ ...acc, [transaction.id]: transaction }),
        state
      );

    case "CLEAR_TRANSACTIONS":
      return {};

    default:
      return state;
  }
};

const incomingPendingTransactions = (state = [], action) =>
  action.type === "LOAD_INCOMING_PENDING" ? action.payload : state;

const security = (state = {}, action) => {
  switch (action.type) {
    case "SET_TOUCH_ID":
      return { ...state, touchId: action.payload };

    default:
      return state;
  }
};

const maintenanceMode = (state = {}, action) => {
  switch (action.type) {
    case "SET_MAINTENANCE_MODE":
      return action.payload;

    default:
      return state;
  }
};

const favorites = (state = {}, action) => {
  switch (action.type) {
    case "ADD_FAVORITE": {
      const { id, ...rest } = action.payload;
      return {
        ...state,
        [id]: rest
      };
    }

    case "EDIT_FAVORITE": {
      const { id, ...rest } = action.payload;
      return {
        ...state,
        [id]: rest
      };
    }

    case "REMOVE_FAVORITE": {
      let { [action.payload]: omit, ...rest } = state;
      return rest;
    }

    default:
      return state;
  }
};

export const syncStorage = store => next => async action => {
  const currentState = store.getState();
  const result = next(action);
  const nextState = store.getState();

  for (let i = 0, l = keysToSync.length; i < l; i++) {
    const key = keysToSync[i];
    const currentValue = currentState[key];
    const nextValue = nextState[key];
    if (!shallowequal(currentValue, nextValue)) {
      await keyChainSet(key, JSON.stringify(nextValue));
    }
  }

  return result;
};

const appReducer = combineReducers({
  appFlow,
  keypair,
  protectedKeypair,
  keypairLinks,
  security,
  favorites,
  name,
  contacts,
  inflationDestination,
  lumenContacts,
  contactsFilter,
  filterFederationAddress,
  preferredCurrency,
  incomingPendingTransactions,
  pendingTransactions,
  transactions,
  maintenanceMode,
  lumenPrice,
  bitcoinPrice,
  ethereumPrice,
  litecoinPrice,
  mobiusPrice,
  otherBalances,
  stellarAccount
});

export default (state = {}, action) => {
  if (action.type === "__REPLACE_STATE__") {
    state = action.payload;
  }

  if (action.type === "DANGER_WIPE_STATE") {
    state = {};
  }

  return appReducer(state, action);
};
