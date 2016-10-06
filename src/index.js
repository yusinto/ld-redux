import {bindActionCreators} from 'redux'
import ldClient from 'ldclient-js';
import guid from 'guid';
import ip from 'ip';
import UAParser from 'ua-parser-js';
import camelCase from 'lodash/camelCase';
import {setLDReady} from './actions';
import reducer from './reducer';
import connect from './decorator';
import {initialiseFlags} from './actions';

const userAgentParser = new UAParser();
const isMobileDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'mobile';
const isTabletDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'tablet';

export const initLD = (clientSideId, reduxStore, user) => {
  if (!user) {
    let device;

    if (isMobileDevice) {
      device = 'mobile';
    } else if (isTabletDevice) {
      device = 'tablet';
    } else {
      device = 'desktop';
    }

    user = {
      key: guid.raw(),
      ip: ip.address(),
      custom: {
        browser: userAgentParser.getResult().browser.name,
        device,
      },
    };
  }

  window.ldClient = ldClient.initialize(clientSideId, user);
  window.ldClient.on('ready', () => {
    console.log(`ldclient ready. user: ${JSON.stringify(user)}`);
    reduxStore.dispatch(setLDReady());
  });
};

export const getFlagsFromState = (state, flags) => {
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

export const mapActionsToProps = (...actions) => {
  return (dispatch) => {
    return bindActionCreators(Object.assign({}, ...actions, {initialiseFlags}), dispatch);
  };
};

export const ldConnect = connect;
export const ldReducer = reducer;
