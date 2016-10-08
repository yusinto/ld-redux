# ld-redux

[![npm version](https://img.shields.io/npm/v/ld-redux.svg?style=flat-square)](https://www.npmjs.com/package/ld-redux) [![npm downloads](https://img.shields.io/npm/dm/ld-redux.svg?style=flat-square)](https://www.npmjs.com/package/ld-redux)

> **A library to integrate launch darkly feature toggle with react redux** :clap:

Server Sent Events works as well so your app will respond live to feature flag changes without the users having to refresh the browser!

More documentation coming soon.

## Installation

npm i --save ld-redux

## Quickstart

1. In your client bootstrap, initialise the launch darkly client by invoking initLD method:

    ```javascript
    import {initLD} from 'ld-redux';
    
    const store = createStore();
    
    // Pass redux store to ld-redux so it can store flags in redux state
    initLD('yourClientSideId', store);
    
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
    import {ldReducer} from 'ld-redux';
    import reducers from '<your-project>/reducers'; 
   
    export default combineReducers({
      ...reducers,
      LD: ldReducer,
    });
    ```

3. Subscribe to flags in your redux container:
    
    ```javascript
    import {connect} from 'react-redux';
    import {getFlagsFromState, ldConnect} from 'ld-redux';
    import * as yourActions from '<your-project>/actions/yourActions';
    
    // These must be the keys you set up in launch darkly dashboard (kebab-lower-cased)
    const defaultFlags = {'feature-flag-key': false};
    
    const mapStateToProps = (state) => {
      // Use getFlagsFromState to access flags from LD state
      const flags = getFlagsFromState(state, defaultFlags);
    
      return {
        ...flags,
      };
    };
    
    // Use ldConnect to connect your component to the feature flags it needs
    @connect(mapStateToProps, yourActions)
    @ldConnect(defaultFlags)
    export default class HomeContainer extends Component {
      render() {
        return <HomeComponent {...this.props} />;
      }
    };
    ```
    
4. Finally in your component, your feature flags are available from props in camelCase:

    ```javascript
    import React, {Component} from 'react';
    
    export default class Home extends Component {
      render() {
        return (
          <div>
            {
              /* featureFlagKey injected by ld-redux */
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

## Example
Check the [example](https://github.com/yusinto/ld-redux/tree/master/example) for a complete working spa with react, redux and react-router. 