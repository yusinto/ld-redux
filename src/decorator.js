import React, {Component} from 'react'; // eslint-disable-line import/no-unresolved, import/extensions
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import {setFlags} from './actions';

export default (flags) => (WrappedComponent) => {
  class WithFeatureFlags extends Component {
    // Need the store through context to call dispatch
    // https://github.com/reactjs/redux/issues/362
    static contextTypes = {
      store: PropTypes.object.isRequired,
    };

    static propTypes = {
      isLDReady: PropTypes.bool,
    };

    constructor(props) {
      super(props);
      this.initialise = ::this.initialise;
    }

    componentDidMount() {
      if (this.props.isLDReady) {
        this.initialise();
      }
    }

    componentWillReceiveProps(newProps) {
      if (newProps.isLDReady && !this.props.isLDReady) {
        this.initialise();
      }
    }

    initialise() {
      const {dispatch, getState} = this.context.store;
      const flagValues = {};
      const {LD} = getState();
      const {isLDReady, ...featureFlags} = LD;

      // If the flags have been retrieved on the server side, then we don't need
      // to re-retrieve them on the client side. If we do, the flag settings
      // would be overridden with the defaults set on the client.
      const isFeatureFlagsRetrieved = Object.entries(featureFlags).length > 0;

      for (const flag in flags) {
        const camelCasedKey = camelCase(flag);

        if (!isFeatureFlagsRetrieved) {
            flagValues[camelCasedKey] = ldClient.variation(flag, flags[flag]);
        }

        ldClient.on(`change:${flag}`, (current) => {
          const newFlagValues = {};
          newFlagValues[camelCasedKey] = current;

          dispatch(setFlags(newFlagValues));
        });
      }

      if (!isFeatureFlagsRetrieved) {
          dispatch(setFlags(flagValues));
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return WithFeatureFlags;
};
