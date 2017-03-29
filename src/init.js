import ldClient from 'ldclient-js';
import uuid from 'uuid';
import ip from 'ip';
import UAParser from 'ua-parser-js';
import {setLDReady} from './actions';

const userAgentParser = new UAParser();
const isMobileDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'mobile';
const isTabletDevice = typeof window !== 'undefined' && userAgentParser.getDevice().type === 'tablet';

export default (clientSideId, reduxStore, user) => {
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
      key: uuid.v4(),
      ip: ip.address(),
      custom: {
        browser: userAgentParser.getResult().browser.name,
        device,
      },
    };
  }

  window.ldClient = ldClient.initialize(clientSideId, user);
  window.ldClient.on('ready', () => {
    reduxStore.dispatch(setLDReady());
  });
};
