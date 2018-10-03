import React, {Component} from 'react';
// import {Link} from 'react-router';
// import Hot from 'hot';

export default class App extends Component {
  state = {};

  componentDidMount() {
    setTimeout(() => this.setState({Hot: window.hot}));
  }
  render() {
    const {Hot} = this.state;
    return (
      <div>
        {
          Hot ? <Hot/> : 'nothing yet'
        }
      </div>
    );
  }
}