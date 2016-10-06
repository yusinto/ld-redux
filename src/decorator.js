import React, {PropTypes, Component} from 'react';

export default (flags) => (WrappedComponent) => {
  class WithFeatureFlags extends Component {
    static propTypes = {
      isLDReady: PropTypes.bool,
    };

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

    initialise = () => {
      this.props.initialiseFlags(flags);
    };

    render() {
      return (
        <div>
          <WrappedComponent
            {...this.props}
          />
        </div>
      );
    }
  }

  return WithFeatureFlags;
};
