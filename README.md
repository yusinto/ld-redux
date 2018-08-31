# ld-redux

[![npm version](https://img.shields.io/npm/v/ld-redux.svg?style=flat-square)](https://www.npmjs.com/package/ld-redux) [![npm downloads](https://img.shields.io/npm/dm/ld-redux.svg?style=flat-square)](https://www.npmjs.com/package/ld-redux) [![npm](https://img.shields.io/npm/dt/ld-redux.svg?style=flat-square)](https://www.npmjs.com/package/ld-redux) [![npm](https://img.shields.io/npm/l/ld-redux.svg?style=flat-square)](https://www.npmjs.com/package/ld-redux)

> **A library to integrate launch darkly with react redux** :clap:

[Launch Darkly](https://launchdarkly.com/faq.html) is a great tool for feature flagging and a/b testing. It has a fully capable [client-side javascript sdk](https://github.com/launchdarkly/js-client), so why this package?

If you use react redux and you want to store your feature flags as part of your redux state, this package will do that for you. It does the heavy lifting of:

 * Fetching your flags from launch darkly.
 * Storing it in your redux state.
 * Camel casing your keys so you can use them in code with the dot operator. The keys by default are dash separated so you can't do this out of the box with the [official sdk](https://github.com/launchdarkly/js-client).
 * Server Sent Event works as well so your app will respond live to feature flag changes without the users having to refresh the browser!

## Breaking changes in v3.1
ld-redux v3.1.* is *NOT* backwards compatible! The init method now accepts dispatch instead of
store. Follow the quickstart example below to see this.

## Installation

yarn add ld-redux

## Quickstart

1. In your client bootstrap, initialise the launch darkly client by invoking the init method:

    ```javascript
    import createStore from '<your-project>/store';
    import ldRedux from 'ld-redux';

    // standard redux createStore
    const store = createStore();

    // do this once
    ldRedux.init({
      clientSideId: 'your-client-side-id',
      dispatch: store.dispatch,
    });

    render(
      <Provider store={store}>
        <Router routes={routes} history={browserHistory}/>
      </Provider>,
      document.getElementById('reactDiv')
    );
    ```

2. Include ldReducer as one of the reducers in your app:

    ```javascript
    import { combineReducers } from 'redux';
    import ldRedux from 'ld-redux';
    import reducers from '<your-project>/reducers';

    export default combineReducers({
      ...reducers,
      LD: ldRedux.reducer(), // Note: the LD key can be anything you want
    });
    ```

3. Use the flag:

    ```javascript
    import React, {Component} from 'react';
    import {connect} from 'react-redux';

    const mapStateToProps = (state) => {
      const {featureFlagKey} = state.LD; // Note: the key LD must be the same as step 2.

      return {
        featureFlagKey,
      };
    };

    @connect(mapStateToProps)
    export default class Home extends Component {
      render() {
        return (
          <div>
            {
              /* look ma, feature flag! */
              this.props.featureFlagKey ?
                <div>
                  <p>Welcome to feature toggling!</p>
                </div>
                :
                'nothing'
            }
          </div>
        );
      }
    }
    ```

## API
### init({clientSideId, dispatch, flags, user, options})
The init method accepts an object with the above properties. `clientSideId`, `dispatch` are mandatory.

The `flags` property is optional. This is an object containing all the flags you want to use and subscribe to in your app.
If you don't specify this, ld-redux will subscribe to all flags in your ld environment.

```javascript
// standard redux createStore
const store = createStore();
const flags = { 'feature-flag-key': false }; // only subscribe to  this one flag

// do this once
ldRedux.init({
  clientSideId: 'your-client-side-id',
  dispatch: store.dispatch,
  flags,
});
```

The `user` property is optional. You can initialise the sdk with a custom user by specifying one. This must be an object containing
at least a "key" property. If you don't specify a user object, ldRedux will create a default one that looks like this:

```javascript
const defaultUser = {
  key: uuid.v4(), // random guid
  ip: ip.address(),
  custom: {
    browser: userAgentParser.getResult().browser.name,
    device
  }
};
```

For more info on the user object, see [here](http://docs.launchdarkly.com/docs/js-sdk-reference#section-users).

The `options` property is optional. It can be used to pass in extra options such as [Bootstrapping](https://github.com/launchdarkly/js-client#bootstrapping).
For example:

```javascript
ldRedux.init({
    clientSideId,
    dispatch,
    flags,
    options: {
      bootstrap: 'localStorage',
    }
});
```

### reducer()
This is ld-redux's reducer. You must include this reducer in your app as per step 2 above with any key of your choice.
You then use this key to retrieve your flags from redux's state.

### window.ldClient
Internally the ldRedux.init method above initialises the js sdk and stores the resultant ldClient object in window.ldClient. You can use
this object to access the [official sdk methods](https://github.com/launchdarkly/js-client) directly. For example, you can do things like:

```javascript
// track goals
window.ldClient.track('add to cart');

// change user context
window.ldClient.identify({key: 'someUserId'});
```

For more info on changing user context, see the [official documentation](http://docs.launchdarkly.com/docs/js-sdk-reference#section-changing-the-user-context).

### isLDReady
You no longer need to deal with `isLDReady`. However if you need to, it is still available in the store. You can access it via
the LD state like so:

```javascript
const mapStateToProps = (state) => {
  const {isLDReady} = state.LD; // Note: the key LD must be the same as step 2.

  return {
    isLDReady,
  };
};
```

This is useful to solve "flickering" issues above the fold on your front page caused by a flag transitioning from a default false value
to true.

## Example
Check the [example](https://github.com/yusinto/ld-redux/tree/master/example) for a fully working spa with 
react, redux and react-router. Remember to enter your client side sdk in the client [bootstrap file](https://github.com/yusinto/ld-redux/blob/master/example/src/client/index.js) 
before running the example!
