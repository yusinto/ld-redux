import React, {Component} from 'react';

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
          this.props.randomNumberFlag ?
            <div>
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