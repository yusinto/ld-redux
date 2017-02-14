import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from '../universal/routes';
import {Provider} from 'react-redux';
import createStore from '../universal/redux/store';
import ldRedux from '../../../lib';

const reduxState = window.__INITIAL_STATE__ || undefined;
const store = createStore(reduxState);

ldRedux.init('your-client-side-id', store);

render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory}/>
  </Provider>,
  document.getElementById('reactDiv')
);
