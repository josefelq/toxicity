import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li id="buttonHolder">
            <a href="/auth/steam">
              <img
                src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_02.png"
                alt="Sign in with steam"
              />
            </a>
          </li>
        );
      default:
        return (
          <li>
            <a href="/api/logout">Logout</a>
          </li>
        );
    }
  }
  render() {
    return (
      <nav>
        <div className="nav-wrapper z-depth-1">
          <div className="container">
            <div className="col s12 m12 l12">
              <Link to="/" className="brand-logo">
                !Tilt
              </Link>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                {this.renderContent()}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
