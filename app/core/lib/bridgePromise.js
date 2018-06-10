import Deferred from "app/lib/Deferred";
import uuid from "uuid/v1";

let stellarBridge = null;
let bridgePromises = {};

export const bridgePromise = (fn, data = {}) => {
  const id = uuid();
  const deferred = new Deferred();
  bridgePromises[id] = { id, deferred, fn, data, didTimeOut: false };

  bridgePromises[id].timeout = setTimeout(() => {
    bridgePromises[id].didTimeOut = true;
    deferred.reject(new Error(`${fn} bridgePromise timeout`));
  }, 30000);

  if (stellarBridge) {
    stellarBridge(JSON.stringify({ id, fn, data }));
  }

  return deferred.promise;
};

export const initializeStellarBridge = postMessage => () => {
  stellarBridge = postMessage;
  Object.keys(bridgePromises).forEach(id => {
    const promiseRecord = bridgePromises[id];
    stellarBridge(
      JSON.stringify({
        id: promiseRecord.id,
        fn: promiseRecord.fn,
        data: promiseRecord.data
      })
    );
  });
};

export const stellarBridgeMessage = json => () => {
  const { id, ...data } = json;
  const { [id]: bridgePromise, ...restOfPromises } = bridgePromises;
  bridgePromises = restOfPromises;
  clearTimeout(bridgePromise.timeout);

  if (!bridgePromise.didTimeOut) {
    if (data.error) {
      bridgePromise.deferred.reject(data.error);
    } else {
      bridgePromise.deferred.resolve(data);
    }
  }
};
