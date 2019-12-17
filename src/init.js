import { initialize as ldClientInitialize } from 'launchdarkly-js-client-sdk';
import camelCase from 'lodash.camelcase';
import uuid from 'uuid';
import ip from 'ip';
import UAParser from 'ua-parser-js';
import { setFlags as setFlagsAction } from './actions';

const userAgentParser = new UAParser();
const isMobileDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'mobile';
const isTabletDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'tablet';

// initialise flags with default values in ld redux store
const initFlags = (flags, dispatch, useCamelCaseFlagKeys) => {
  const flagValues = { isLDReady: false };
  for (const flag in flags) {
    if (useCamelCaseFlagKeys) {
      const camelCasedKey = camelCase(flag);
      flagValues[camelCasedKey] = flags[flag];
    } else {
      flagValues[flag] = flags[flag];
    }
  }
  dispatch(setFlagsAction(flagValues));
};

// set flags with real values from ld server
const setFlags = (flags, dispatch, useCamelCaseFlagKeys) => {
  const flagValues = { isLDReady: true };
  for (const flag in flags) {
    const flagKey = useCamelCaseFlagKeys ? camelCase(flag) : flag;
    flagValues[flagKey] = ldClient.variation(flag, flags[flag]);
  }
  dispatch(setFlagsAction(flagValues));
};

const subscribeToChanges = (flags, dispatch) => {
  for (const flag in flags) {
    const camelCasedKey = camelCase(flag);
    ldClient.on(`change:${flag}`, current => {
      const newFlagValue = {};
      newFlagValue[camelCasedKey] = current;
      dispatch(setFlagsAction(newFlagValue));
    });
  }
};

const initUser = () => {
  let device;

  if (isMobileDevice) {
    device = 'mobile';
  } else if (isTabletDevice) {
    device = 'tablet';
  } else {
    device = 'desktop';
  }

  return {
    key: uuid.v4(),
    ip: ip.address(),
    custom: {
      browser: userAgentParser.getResult().browser.name,
      device,
    },
  };
};

export default ({ clientSideId, dispatch, flags, useCamelCaseFlagKeys = true, user, subscribe, options }) => {
  initFlags(flags, dispatch, useCamelCaseFlagKeys);

  // default subscribe to true
  const sanitisedSubscribe = typeof subscribe === 'undefined' ? true : subscribe;

  if (!user) {
    user = initUser();
  }

  window.ldClient = ldClientInitialize(clientSideId, user, options);
  window.ldClient.on('ready', () => {
    const flagsSanitised = flags || ldClient.allFlags();
    setFlags(flagsSanitised, dispatch, useCamelCaseFlagKeys);

    if (sanitisedSubscribe) {
      subscribeToChanges(flagsSanitised, dispatch);
    }
  });
};
