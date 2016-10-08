import React, {Component} from 'react';
import {Link} from 'react-router';

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>Launch Darkly ld-redux demo</h1>
        <span>
          {
            this.props.location.pathname === '/' || this.props.location.pathname === '/home' ?
              <span>Home</span> : <Link to="/">Home</Link>
          }
        </span>
        {' '} | {' '}
        <span>
          {
            this.props.location.pathname === '/contact' ?
              <span>Contact Us</span> : <Link to="/contact">Contact Us</Link>
          }
        </span>
        <div>
          <br/>
          {this.props.children}
        </div>
      </div>
    );
  }
}