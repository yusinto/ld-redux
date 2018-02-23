import React from 'react';
import {Route, IndexRoute} from 'react-router';
import App from './domain/app/appComponent';
import Home from './domain/home/home';

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home}/>
  </Route>
);

export default routes;