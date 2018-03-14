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
const initFlags = (flags, store) => {
  const flagValues = {isLDReady: false};
  if (Array.isArray(flags)) {
    flags.forEach((flag) => {
      flagValues[flag.reduxKey] = flag.default;
    });
  } else {
    for (const flag in flags) {
      const camelCasedKey = camelCase(flag);
      flagValues[camelCasedKey] = flags[flag];
    }
  }

  store.dispatch(setFlagsAction(flagValues));
};

// set flags with real values from ld server
const setFlags = (flags, store) => {
  const flagValues = {isLDReady: true};
  if (Array.isArray(flags)) {
    flags.forEach((flag) => {
      flagValues[flag.reduxKey] = ldClient.variation(flag.key, flag.default);
    });
  } else {
    for (const flag in flags) {
      const camelCasedKey = camelCase(flag);
      flagValues[camelCasedKey] = ldClient.variation(flag, flags[flag]);
    }
  }

  // Wrapped dispatch in a setTimeout to prevent React client/server mismatches and the associated unexpected consequences
  setTimeout(() => store.dispatch(setFlagsAction(flagValues)));
};

const subscribeToChanges = (flags, store) => {
  if (Array.isArray(flags)) {
    flags.forEach((flag) => {
      ldClient.on(`change:${flag.key}`, (current) => {
        const newFlagValue = {};
        newFlagValue[flag.reduxKey] = current;
        store.dispatch(setFlagsAction(newFlagValue));
      });
    });
  } else {
    for (const flag in flags) {
      const camelCasedKey = camelCase(flag);
      ldClient.on(`change:${flag}`, (current) => {
        const newFlagValue = {};
        newFlagValue[camelCasedKey] = current;
        store.dispatch(setFlagsAction(newFlagValue));
      });
    }
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

export default ({clientSideId, store, flags, user, options}) => {
  initFlags(flags, store);

  if (!user) {
    user = initUser();
  }

  window.ldClient = ldClientPackage.initialize(clientSideId, user, options);
  window.ldClient.on('ready', () => {
    setFlags(flags, store);
    subscribeToChanges(flags, store);
  });
};
