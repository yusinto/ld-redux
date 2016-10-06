# ld-redux
A library to integrate launch darkly feature toggles with react redux

Documentation coming soon

Quickstart:
1. You'll need redux-thunk and set it up as middleware when creating 
your redux store:
```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer';

export default function() {
  const store = createStore(reducers, applyMiddleware(thunk));
  return store;
};
```

2. In your client bootstrap:
```javascript
import {initLD} from 'ld-redux';
const store = createStore();
initLD('57d3a57f53f8630721228f2d', store);
```
3. In your main reducer file:
```javascript
import {ldReducer} from 'ld-redux';

export default combineReducers({
  yourReducer1,
  yourReducer2,
  LD: ldReducer,
});
```
4. Then in a redux container:
```javascript
import {getFlagsFromState, mapActionsToProps, ldConnect} from 'ld-redux';

// These must be the keys you set up in launch darkly dashboard (kebab-lower-cased)
const defaultFlags = {'random-number': false};

const mapStateToProps = (state) => {
  // this is your own state
  const homeState = state.Home;

  // Use helper method to subscribe to your flags as camelCased props
  const flags = getFlagsFromState(state, defaultFlags);

  return {
    someRandomNumber: homeState.someRandomNumber,
    ...flags,
  };
};

// Use helper method to create mapDispatchToProps, passing your actions to the helper method
@connect(mapStateToProps, mapActionsToProps(homeActions))
@ldConnect(defaultFlags) // connect the component to the feature flags it needs
export default class HomeContainer extends Component {
  render() {
    return <HomeComponent {...this.props} />;
  }
};
```
