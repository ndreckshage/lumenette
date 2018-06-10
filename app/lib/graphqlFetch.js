import {API_BASE} from 'react-native-dotenv';
import DeviceInfo from 'react-native-device-info';

const version = DeviceInfo.getVersion();
const os = DeviceInfo.getSystemName();

if (!API_BASE) {
  throw new Error('no base api url');
}

const endpoint = `${API_BASE}/graphql`;

const FETCH_TIMEOUT = 8000;

const fetchWithTimeout = (endpoint, data, extra) =>
  new Promise((resolve, reject) => {
    let didTimeOut = false;
    const timeout = setTimeout(() => {
      didTimeOut = true;
      reject(new Error(`Request timed out ${endpoint} ${extra.operationName}`));
    }, FETCH_TIMEOUT);

    fetch(endpoint, data)
      .then(response => {
        clearTimeout(timeout);
        if (!didTimeOut) {
          resolve(response);
        }
      })
      .catch(err => {
        clearTimeout(timeout);
        if (!didTimeOut) {
          reject(err);
        }
      });
  });

export default (query, variables = null) =>
  fetchWithTimeout(
    endpoint,
    {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
        'app-version': version,
        'app-os': os
      }),
      body: JSON.stringify({
        query: query.loc.source.body,
        variables,
        operationName: query.definitions[0].name.value
      })
    },
    {
      operationName: query.definitions[0].name.value
    }
  ).then(res => {
    // always set but just in case
    if (global.__redux_store__) {
      const payload = {
        maintenanceMode: res.headers.get('maintenance-mode'),
        maintenanceReason: res.headers.get('maintenance-reason'),
        maintenanceForceUpgrade: res.headers.get('maintenance-force-upgrade')
      };

      global.__redux_store__.dispatch({
        type: 'SET_MAINTENANCE_MODE',
        payload
      });
    }

    return res.json();
  });
