import React from 'react';
import {Link} from 'react-router';

const App = ({location: {pathname}, children}) => {
  return (
    <div>
      <h1>Launch Darkly ld-redux demo</h1>
        <span>
          {
            pathname === '/' || pathname === '/home' ?
              <span>Home</span> : <Link to="/">Home</Link>
          }
        </span>
      {' '} | {' '}
        <span>
          {
            pathname === '/contact' ?
              <span>Contact Us</span> : <Link to="/contact">Contact Us</Link>
          }
        </span>
      <div>
        <br/>
        {children}
      </div>
    </div>
  );
};

export default App;