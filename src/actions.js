import Constants from './constants';

export const setFlags = (flags) => {
  return {
    type: Constants.SET_FLAGS,
    data: flags,
  };
};