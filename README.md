# ld-redux

A library to integrate launch darkly feature toggles with react redux.

Server Sent Events works as well so your app will respond live to feature flag changes without the users having to refresh the browser!

More documentation coming soon.

### Quickstart

1. npm i redux-thunk ld-redux --save
 Then set up thunk as middleware:

    ```javascript
    import { createStore, applyMiddleware } from 'redux';
    import thunk from 'redux-thunk';
    import reducers from '../reducer';
    
    export default function() {
      const store = createStore(reducers, applyMiddleware(thunk));
      return store;
    };
    ```


2. In your client bootstrap, initialise the launch darkly client by invoking initLD method:

    ```javascript
    import {initLD} from 'ld-redux'; // do this
    
    const store = createStore();
    
    // You can find your clientSideId under Account Settings in launch darkly's dashboard 
    initLD('your-ld-client-side-id', store); // and do this
    
    render(
      <Provider store={store}>
        <Router routes={routes} history={browserHistory}/>
      </Provider>,
      document.getElementById('reactDiv')
    );
    ```


3. Include ldReducer as one of the reducers in your app:

    ```javascript
    import { combineReducers } from 'redux';
    import {ldReducer} from 'ld-redux'; // do this
    
    export default combineReducers({
      App,
      LD: ldReducer, // and this
    });
    ```


4. Then in a redux container, declare the kebab-lower-cased keys you setup in launch darkly's dashboard as an object. You'll need 3 helper methods from ld-redux:
    * getFlagsFromState - returns flag values from redux state.
    * mapActionsToProps - maps your redux actions to props and also injects an internal initialiseFlags method required to initialise flags for this component.
    * ldConnect - connect your component to the specified flags.
    
    
    ```javascript
    import {connect} from 'react-redux';
    import * as homeActions from '../action/homeAction';
    import {getFlagsFromState, mapActionsToProps, ldConnect} from 'ld-redux';
    
    // These must be the keys you set up in launch darkly dashboard (kebab-lower-cased)
    const defaultFlags = {'feature-flag-key': false};
    
    const mapStateToProps = (state) => {
      const homeState = state.Home;
    
      // Use getFlagsFromState to subscribe to your flags as camelCased props i.e. 
      // your kebab-cased flags will be available in your component as this.props.camelCased
      const flags = getFlagsFromState(state, defaultFlags);
    
      return {
        someState: homeState.someState,
        ...flags,
      };
    };
    
    // Use mapActionsToProps to map your actions to props
    @connect(mapStateToProps, mapActionsToProps(homeActions))
    @ldConnect(defaultFlags) // connect the component to the feature flags it needs
    export default class HomeContainer extends Component {
      render() {
        return <HomeComponent {...this.props} />;
      }
    };
    ```
    
    
5. Finally in your component, use your feature flag as this.props.camelCased:

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
