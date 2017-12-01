import React, {Component} from 'react'; // eslint-disable-line import/no-unresolved, import/extensions
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import {setFlags} from './actions';

export default flags => (WrappedComponent) => {
  class WithFeatureFlags extends Component {
    // Need the store through context to call dispatch
    // https://github.com/reactjs/redux/issues/362
    static contextTypes = {
      store: PropTypes.object.isRequired,
    };

    static propTypes = {
      isLDReadyClient: PropTypes.bool,
      isLDReadyServer: PropTypes.bool,
    };

    state = {
      featureFlagOnChangeInitialised: false,
    };

    constructor(props) {
      super(props);
      this.initialise = ::this.initialise;
    }

    componentDidMount() {
      if (this.props.isLDReadyClient || this.props.isLDReadyServer) {
        this.initialise();
      }
    }

    componentWillReceiveProps(newProps) {
      if ((newProps.isLDReadyClient && !this.props.isLDReadyClient) ||
          (newProps.isLDReadyServer && !this.props.isLDReadyServer)
      ) {
        this.initialise();
      }
    }

    initialise() {
      const {dispatch, getState} = this.context.store;
      const {featureFlagOnChangeInitialised} = this.state;
      const flagValues = {};
      const {LD} = getState();
      const {isLDReadyClient, isLDReadyServer} = LD; //eslint-disable-line no-unused-vars

      for (const flag in flags) {
        const camelCasedKey = camelCase(flag);

        // When ld client becomes ready, request the flags from the client side.
        // These should override any flags hydrated from the server side.
        // The reason why override the server flags is because they may be
        // outdated due to caching (on CDN or server).
        if (isLDReadyClient) {
            flagValues[camelCasedKey] = ldClient.variation(flag, flags[flag]);
        }

        // We don't set the on change handler more than once.
        if(!featureFlagOnChangeInitialised) {
          ldClient.on(`change:${flag}`, (current) => {
              const newFlagValues = {};
              newFlagValues[camelCasedKey] = current;

              dispatch(setFlags(newFlagValues));
          });
        }
      }

      dispatch(setFlags(flagValues));
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return WithFeatureFlags;
};
