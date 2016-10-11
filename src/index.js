import camelCase from 'lodash/camelCase';
import init from './init';
import reducer from './reducer';
import connect from './decorator';

const getFlags = (state, flags) => {
  const ldState = state.LD;
  const c = {};

  if (flags) {
    for (const key in flags) {
      const camelCaseKey = camelCase(key);
      const stateValue = ldState[camelCaseKey];
      c[camelCaseKey] = typeof stateValue === 'undefined' ? flags[key] : stateValue;
    }
  }

  return {
    isLDReady: ldState.isLDReady,
    ...c,
  };
};

export const ldConnect = connect;

export default {
  init,
  getFlags,
  reducer: () => reducer,
};