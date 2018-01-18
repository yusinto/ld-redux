import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from '../universal/routes';
import {Provider} from 'react-redux';
import createStore from '../universal/redux/store';
import ldRedux from '../../../lib';
import flags from '../../flags.json';

const reduxState = window.__INITIAL_STATE__ || undefined;
const reduxStore = createStore(reduxState);

ldRedux.init({
  clientSideId: 'your-client-side-id',
  reduxStore,
  flags,
});

render(
  <Provider store={reduxStore}>
    <Router routes={routes} history={browserHistory}/>
  </Provider>,
  document.getElementById('reactDiv')
);
