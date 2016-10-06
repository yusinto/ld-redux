import camelCase from 'lodash/camelCase';
import Constants from './constants';

// Stores launch darkly client object in app state
export const setLDReady = () => {
  return {
    type: Constants.LD_READY,
  }
};

const setFlags = flags => {
  return {
    type: Constants.SET_FLAGS,
    data: flags,
  }
};

export const initialiseFlags = flags => {
  return dispatch => {
    const flagValues = {};

    for (const flag in flags) {
      const camelCasedKey = camelCase(flag);
      flagValues[camelCasedKey] = ldClient.variation(flag, flags[flag]);

      ldClient.on(`change:${flag}`, current => {
        const newFlagValues = {};
        newFlagValues[camelCasedKey] = current;

        dispatch(setFlags(newFlagValues));
      });
    }

    dispatch(setFlags(flagValues));
  };
};
