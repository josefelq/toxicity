import React, { Component } from 'react';
import { connect } from 'react-redux';

class Home extends Component {
  render() {
    const { auth } = this.props;
    console.log(this.props.auth);
    if (!auth) {
      return <div />;
    }
    return <div>{auth.steamId}</div>;
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Home);
