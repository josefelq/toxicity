import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    return (
      <footer className="page-footer blue-grey darken-3">
        <div className="container">
          <div className="row">
            <div className="col l6 s12">
              <h5 className="white-text">About us</h5>
              <p className="grey-text text-lighten-4">
                Add, report and track the most toxic Steam users you find on
                your multiplayer games. Icons made by{' '}
                <a href="http://www.freepik.com" title="Freepik" id="contrast">
                  Freepik
                </a>{' '}
                from{' '}
                <a
                  href="https://www.flaticon.com/"
                  title="Flaticon"
                  id="contrast">
                  www.flaticon.com
                </a>{' '}
                is licensed by{' '}
                <a
                  id="contrast"
                  href="http://creativecommons.org/licenses/by/3.0/"
                  title="Creative Commons BY 3.0"
                  target="_blank">
                  CC 3.0 BY
                </a>
              </p>
            </div>
            <div className="col l4 offset-l2 s12">
              <h5 className="white-text">Other</h5>
              <ul>
                <li>
                  <Link to="/" className="highlight">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboards" className="highlight">
                    Most Wanted
                  </Link>
                </li>
                <li>
                  <a className="highlight" href="https://josefelq.github.io/">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
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
