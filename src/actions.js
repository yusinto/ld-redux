import Constants from './constants';

export const setLDReady = () => {
  return {
    type: Constants.LD_READY,
  }
};

export const setFlags = flags => {
  return {
    type: Constants.SET_FLAGS,
    data: flags,
  }
};