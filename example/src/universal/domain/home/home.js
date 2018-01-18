import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as homeActions from './homeAction';

const mapStateToProps = (state) => {
  const homeState = state.Home;
  const {testCafeGodMode} = state.LD;

  return {
    ...homeState,
    testCafeGodMode,
  };
};

@connect(mapStateToProps, homeActions)
export default class Home extends Component {
  onClickGenerateRandom = () => {
    this.props.generateRandom();
  };

  render() {
    return (
      <div>
        <p>
          Welcome to ld-redux test app!
        </p>
        {
          this.props.testCafeGodMode ?
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