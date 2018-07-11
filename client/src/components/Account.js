import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Header from './Header';
import Footer from './Footer';
import Loading from './Loading';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null, sentRequest: false };
  }

  render() {
    return (
      <div className="wrapper">
        <Header
          useSearchBar={term => {
            this.useSearchBar(term);
          }}
        />
        <main>{this.renderContent()}</main>
        <Footer />
      </div>
    );
  }

  renderContent() {
    switch (this.props.auth) {
      case null:
        return (
          <div className="wrapper">
            <Loading />
          </div>
        );
      case false:
        return (
          <div className="container content">{this.renderNoProfile()}</div>
        );
      default:
        return <div className="container content">{this.renderProfile()}</div>;
    }
  }

  //VERY IMPORTANT FOR SEARCH_BAR
  useSearchBar(path) {
    this.props.history.push(path);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.init(id);
  }

  async init(id) {
    const request = await axios.get(`/api/users/${id}`);
    this.setState({ user: request.data });
  }

  updateUser() {
    if (!this.state.sentRequest) {
      this.setState({ sentRequest: true }, async () => {
        const result = await axios.post(
          `/api/users/${this.props.auth._id}/update`
        );
        this.setState({ sentRequest: false }, () => {
          if (result.data) {
            this.setState({ user: result.data });
          } else {
            alert('Could not update steam data.');
          }
        });
      });
    }
  }

  renderProfile() {
    switch (this.state.user) {
      case null:
        return;
      default:
        return (
          <div className="row">
            <div className="col s3">
              <div className="card small">
                <div className="card-image">
                  <img src={this.state.user.steamAvatar} alt="User avatar" />
                </div>
                <div className="card-content">
                  <b className="truncate">{this.state.user.steamName}</b>
                </div>
                <div className="card-action">
                  <a onClick={this.updateUser.bind(this)}>Update Info</a>
                </div>
              </div>
            </div>
          </div>
        );
    }
  }

  renderNoProfile() {
    return (
      <div className="row vertical-align">
        <div className="col s8 offset-s2 main-text">
          <div className="card blue-grey darken-2">
            <div className="card-content">
              <span className="card-title">Uh, what?</span>
              <p>
                You need to be logged into your steam account in order to use
                this feature.
              </p>
            </div>
            <div className="card-action">
              <a href="/auth/steam" className="contrast">
                Sign in through steam
              </a>
              <Link to="/" className="contrast">
                Go back home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Account);
