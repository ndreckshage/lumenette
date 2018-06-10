import {USE_SENTRY, USE_CONSOLE} from 'react-native-dotenv';
import {Sentry} from 'react-native-sentry';

export const logError = (e, pkg = {}) => {
  if (USE_CONSOLE === 'true') {
    // eslint-disable-next-line
    console.log('logError', e, pkg);
  }

  if (USE_SENTRY === 'true') {
    Sentry.captureException(e, pkg);
  }
};

export const logInfo = (msg, extra = {}) => {
  if (USE_CONSOLE === 'true') {
    // eslint-disable-next-line
    console.log('logInfo:', msg, extra);
  }

  if (USE_SENTRY === 'true') {
    Sentry.captureMessage(msg, {extra});
  }
};
