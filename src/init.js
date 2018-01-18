import ldClientPackage from 'ldclient-js';
import camelCase from 'lodash/camelCase';
import uuid from 'uuid';
import ip from 'ip';
import UAParser from 'ua-parser-js';
import {setFlags as setFlagsAction} from './actions';

const userAgentParser = new UAParser();
const isMobileDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'mobile';
const isTabletDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'tablet';

// initialise flags with default values in ld redux store
const initFlags = (flags, reduxStore) => {
  const flagValues = {};
  for (const flag in flags) {
    const camelCasedKey = camelCase(flag);
    flagValues[camelCasedKey] = flags[flag];
  }
  reduxStore.dispatch(setFlagsAction(flagValues));
};

// set flags with real values from ld server
const setFlags = (flags, reduxStore) => {
  const flagValues = {};
  for (const flag in flags) {
    const camelCasedKey = camelCase(flag);
    flagValues[camelCasedKey] = ldClient.variation(flag, flags[flag]);
  }
  reduxStore.dispatch(setFlagsAction(flagValues));
};

const subscribeToChanges = (flags, reduxStore) => {
  for (const flag in flags) {
    const camelCasedKey = camelCase(flag);
    ldClient.on(`change:${flag}`, (current) => {
      const newFlagValue = {};
      newFlagValue[camelCasedKey] = current;
      reduxStore.dispatch(setFlagsAction(newFlagValue));
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

export default ({clientSideId, reduxStore, flags, user, options}) => {
  initFlags(flags, reduxStore);

  if (!user) {
    user = initUser();
  }

  window.ldClient = ldClientPackage.initialize(clientSideId, user, options);
  window.ldClient.on('ready', () => {
    setFlags(flags, reduxStore);
    subscribeToChanges(flags, reduxStore);
  });
};
