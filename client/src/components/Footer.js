import React, { Component } from 'react';
import { connect } from 'react-redux';

class Footer extends Component {
  render() {
    return (
      <footer className="page-footer blue-grey darken-3">
        <div className="footer-copyright">
          <div className="container">
            Copyright © 2018 NoTiltZone, All rights reserved.
            <a
              className="right highlight"
              href="https://github.com/josefelq/toxicity">
              <i className="fab fa-github" /> Source code
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}
export default connect(mapStateToProps)(Footer);
