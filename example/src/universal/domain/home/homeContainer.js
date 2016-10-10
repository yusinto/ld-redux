import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as homeActions from './homeAction';
import HomeComponent from './homeComponent';
import ldRedux, {ldConnect} from 'ld-redux';
import {homeFlags} from './homeLogic';

const mapStateToProps = (state) => {
  const homeState = state.Home;
  const flags = ldRedux.getFlags(state, homeFlags);

  return {
    ...homeState,
    ...flags,
  };
};

@connect(mapStateToProps, homeActions)
@ldConnect(homeFlags)
export default class HomeContainer extends Component {
  render() {
    return <HomeComponent {...this.props} />;
  }
}