import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as homeActions from './homeAction';
import ldRedux, {ldConnect} from '../../../../../lib';

const homeFlags = {
  'dev-test-flag': false
};

const mapStateToProps = (state) => {
  const homeState = state.Home;
  const flags = ldRedux.getFlags(state, homeFlags);

  return {
    ...homeState,
    ...flags
  };
};

@connect(mapStateToProps, homeActions)
@ldConnect(homeFlags)
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.onClickGenerateRandom = ::this.onClickGenerateRandom;
  }

  onClickGenerateRandom() {
    this.props.generateRandom();
  }

  render() {
    return (
      <div>
        <p>
          Welcome to the homepage!
        </p>
        {
          this.props.devTestFlag ?
            <div>
              <p>
                SSE works! If you turn off your flag in launch darkly, your app will respond without a browser refresh.
                Try it!
              </p>
              <button onClick={this.onClickGenerateRandom}>Generate random number</button>
              <p>{this.props.number}</p>
            </div>
            :
            <div>
              The random number generator is turned off.
            </div>
        }
      </div>
    );
  }
}