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
    this.state = { user: null, sentRequest: false, input: '' };
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
    this.init();
  }

  async init() {
    const { id } = this.props.match.params;
    const request = await axios.get(`/api/users/${id}`);
    if (request.data) {
      this.setState({ user: request.data });
    }
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
              <div className="card small blue-grey darken-2">
                <div className="card-image" id="account-image">
                  <img
                    src={this.state.user.steamAvatar}
                    alt="User avatar"
                    className="circle"
                  />
                </div>
                <div className="card-content">
                  <b className="truncate main-text">
                    {this.state.user.steamName}
                  </b>
                </div>
                <div className="card-action">
                  <a
                    onClick={this.updateUser.bind(this)}
                    className={this.state.sentRequest ? '' : 'clicky'}>
                    {this.state.sentRequest ? 'Updating...' : 'Update'}
                  </a>
                </div>
              </div>
            </div>
            <div className="col s9">{this.renderFollowing()}</div>
          </div>
        );
    }
  }

  renderFollowing() {
    return (
      <div className="row">
        <div className="col s2 offset-s10">
          <h5 className="main-text">Reports</h5>
        </div>
        {this.renderMain()}
      </div>
    );
  }

  renderMain() {
    if (this.state.user.following.length === 0) {
      return (
        <div className="col s12 center">
          <b className="secondary-text">
            Looks like you have not reported anyone.
          </b>
        </div>
      );
    } else {
      return (
        <div className="col s12">
          <div className="row">
            <div className="col s12">
              <div className="row">
                <div className="input-field col s12">
                  <input
                    id="text"
                    type="text"
                    value={this.state.input}
                    onChange={event => {
                      this.setState({ input: event.target.value });
                    }}
                    className="main-text"
                  />
                  <label htmlFor="icon_prefix2">
                    Filter by Name or SteamID.
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col s4 offset-s8 main-text">
              You have reported {this.state.user.following.length} user(s).
            </div>
          </div>
          <div className="row">
            <div className="col s12">
              <ul className="collection">{this.renderList()}</ul>
            </div>
          </div>
        </div>
      );
    }
  }

  renderList() {
    let list = this.state.user.following;
    let filteredList;
    if (this.state.input) {
      filteredList = list.filter(element => {
        return (
          element.steamName.startsWith(this.state.input) ||
          element.steamId.startsWith(this.state.input)
        );
      });
    } else {
      filteredList = list;
    }
    //filteredList.reverse();

    let finalList = filteredList.map(element => {
      return (
        <li
          className="collection-item avatar blue-grey darken-2 hoverable li-exception"
          key={element._id}>
          <img
            src={element.steamAvatar}
            alt="Reported user avatar"
            className="circle"
          />
          <span className="title">
            <div className="row">
              <div
                className="col"
                onClick={() => {
                  this.props.history.push(`/suspects/${element.steamId}`);
                }}>
                <p className="clicky lookout main-text truncate">
                  {element.steamName}
                </p>
              </div>
              <div className="col s2">
                <small className="secondary-text">{element.steamId}</small>
              </div>
            </div>
          </span>
          <p className="secondary-text">
            <b>Reports:</b> {element.votes.length}
          </p>
          <a
            className="secondary-content clicky remove-report"
            onClick={() => {
              this.removeReport(element);
            }}>
            Remove Report
          </a>
        </li>
      );
    });
    return finalList;
  }

  removeReport(element) {
    if (!this.state.sentRequest) {
      this.setState({ sentRequest: true }, async () => {
        const url = `/api/suspects/${element.steamId}/unfollow`;
        const request = await axios.post(url, {
          owner: this.props.auth.steamId
        });
        this.setState({ sentRequest: false }, () => {
          if (request.data) {
            this.init();
          }
        });
      });
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
