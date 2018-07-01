import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { input: '', searchClick: false };
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
          <div className="row">
            <div className="col s12">
              <a href="/auth/steam">
                <img
                  src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_02.png"
                  alt="Sign in with steam"
                />
              </a>
            </div>
          </div>
        );
      default:
        return (
          <div className="row">
            <div className="col s6">
              <Link to="/account" className="highlight">
                Account
              </Link>
            </div>
            <div className="col s6">
              <a href="/api/logout" className="highlight">
                Logout
              </a>
            </div>
          </div>
        );
    }
  }
  renderSearchBar() {
    if (this.props.needsHeader) {
      return (
        <div className="row">
          <div className="col s12">{this.renderInput()}</div>
        </div>
      );
    } else {
      return;
    }
  }

  renderDynamicSearch() {
    if (this.state.searchClick) {
      return (
        <div className="col s10">
          <form onSubmit={this.handleSubmit}>
            <div className="input-field ">
              <input
                type="text"
                placeholder="Search"
                id="autocomplete-input"
                className="autocomplete black-text white"
                value={this.state.input}
                onChange={this.handleChange}
              />
            </div>
          </form>
        </div>
      );
    } else {
      return <div className="col s10" />;
    }
  }
  renderInput() {
    return (
      <div className="row">
        {this.renderDynamicSearch()}
        <div className="col s1">
          <i
            className="white-text material-icons prefix searchIcon"
            onClick={() => {
              if (this.state.searchClick) {
                this.setState({ searchClick: false });
              } else {
                this.setState({ searchClick: true });
              }
            }}>
            search
          </i>
        </div>
      </div>
    );
  }

  render() {
    return (
      <header>
        <div className="navbar-fixed">
          <nav>
            <div className="nav-wrapper blue-grey darken-4">
              <div className="container">
                <div className="row">
                  <div className="col s3">
                    <Link to="/" className="brand-logo highlight">
                      No Tilt Zone
                    </Link>
                  </div>
                  <div className="col s2 ">
                    <Link to="/leaderboards" className="highlight">
                      Most Wanted
                    </Link>
                  </div>
                  <div className="col s5">{this.renderSearchBar()}</div>
                  <div className="col s2">{this.renderContent()}</div>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
