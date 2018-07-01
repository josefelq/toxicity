import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import axios from 'axios';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { input: '' };
    this.renderSearchBar = this.renderSearchBar.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    let blankCheck = this.state.input;

    if (blankCheck.replace(' ', '')) {
      const search = await axios.post('/api/suspects/search', {
        uri: this.state.input
      });
      if (search.data) {
        this.props.useSearchBar(`/suspects/${search.data.theId}`);
      } else {
        alert('That steam user does not exist!');
      }
    }
  }

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
  renderSearchBar() {
    if (this.props.needsHeader) {
      return (
        <li>
          <div className="center row">
            <div className="col s12 ">
              <div className="row" id="topbarsearch">
                <form onSubmit={this.handleSubmit}>
                  <div className="input-field col s6 s12 red-text">
                    <i
                      className="white-text material-icons prefix searchIcon"
                      onClick={this.handleSubmit}>
                      search
                    </i>
                    <input
                      type="text"
                      placeholder="Search"
                      id="autocomplete-input"
                      className="autocomplete black-text white center"
                      value={this.state.input}
                      onChange={this.handleChange}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </li>
      );
    } else {
      return;
    }
  }

  render() {
    return (
      <header className="navbar-fixed">
        <nav className="blue-grey darken-4">
          <div className="nav-wrapper">
            <div className="container">
              <div className="col s12 m12 l12">
                <Link to="/" className="brand-logo">
                  No Tilt Zone
                </Link>
                <ul id="nav-mobile" className="right">
                  {this.renderSearchBar()}
                  {this.renderContent()}
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
