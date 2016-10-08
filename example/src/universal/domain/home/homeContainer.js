import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as homeActions from './homeAction';
import HomeComponent from './homeComponent';
import {getFlagsFromState, mapActionsToProps, ldConnect} from 'ld-redux';
import {homeFlags} from './homeLogic';

const mapStateToProps = (state) => {
  const homeState = state.Home;
  const flags = getFlagsFromState(state, homeFlags);

  return {
    ...homeState,
    ...flags,
  };
};

@connect(mapStateToProps, mapActionsToProps(homeActions))
@ldConnect(homeFlags)
export default class HomeContainer extends Component {
  render() {
    return <HomeComponent {...this.props} />;
  }
}