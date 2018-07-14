import React, { Component } from 'react';
import Header from '../Header';
import { connect } from 'react-redux';
import axios from 'axios';

import Loading from '../Loading';
import CommentSection from './CommentSection';
import Footer from '../Footer';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { suspectInfo: null, sentRequest: false };
    this.addUser = this.addUser.bind(this);
    this.followSuspect = this.followSuspect.bind(this);
    this.unfollowSuspect = this.unfollowSuspect.bind(this);
    this.changeProfile = this.changeProfile.bind(this);
    this.useSearchBar = this.useSearchBar.bind(this);
  }

  followSuspect() {
    if (!this.state.sentRequest) {
      this.setState({ sentRequest: true }, () => {
        const { id } = this.props.match.params;
        axios
          .post(`/api/suspects/${id}/follow`, {
            owner: this.props.auth.steamId
          })
          .then(response => {
            if (response.data === true) {
              //this.setState({ suspectInfo: null });
              axios.get(`/api/suspects/${id}`).then(response2 => {
                this.setState({
                  suspectInfo: response2.data,
                  sentRequest: false
                });
              });
            }
          });
      });
    }
  }

  unfollowSuspect() {
    if (!this.state.sentRequest) {
      this.setState({ sentRequest: true }, () => {
        const { id } = this.props.match.params;
        axios
          .post(`/api/suspects/${id}/unfollow`, {
            owner: this.props.auth.steamId
          })
          .then(response => {
            if (response.data === true) {
              //this.setState({ suspectInfo: null });
              axios.get(`/api/suspects/${id}`).then(response2 => {
                this.setState({
                  suspectInfo: response2.data,
                  sentRequest: false
                });
              });
            }
          });
      });
    }
  }

  addUser() {
    if (!this.state.sentRequest) {
      this.setState({ suspectInfo: null, sentRequest: true }, () => {
        const { id } = this.props.match.params;
        axios.post('/api/suspects', { steamId: id }).then(response => {
          this.setState({ suspectInfo: response.data, sentRequest: false });
        });
      });
    }
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    axios.get(`/api/suspects/${id}`).then(response => {
      this.setState({ suspectInfo: response.data });
    });
  }

  changeProfile(response, callback) {
    if (response) {
      const { id } = this.props.match.params;
      axios.get(`/api/suspects/${id}`).then(response => {
        this.setState({ suspectInfo: response.data }, () => {
          callback();
        });
      });
    } else {
      //Comment couldn't be published
    }
  }

  renderProfile() {
    if (this.state.suspectInfo) {
      return (
        <div className="container content">
          <div className="row suspect-info">
            <div className="col s2">
              <img
                className="responsive-img circle"
                src={this.state.suspectInfo.steamAvatar}
                alt="avatar of user"
              />
            </div>
            <div className="col s6">
              <div className="row upper-text">
                <div className="col s12">
                  <h4 className="main-text truncate">
                    {this.state.suspectInfo.steamName}
                  </h4>
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <p className="secondary-text">
                    <b>SteamID:</b> {this.state.suspectInfo.steamId}
                  </p>
                </div>
              </div>
            </div>
            <div className="col s4">{this.renderFollowButton()}</div>
          </div>
          <CommentSection
            comments={this.state.suspectInfo.comments}
            uri={this.props.match.params.id}
            changeProfile={this.changeProfile}
            useSearchBar={term => {
              this.useSearchBar(term);
            }}
          />
        </div>
      );
    }
  }

  renderFollowButton() {
    if (!this.props.auth) {
      return (
        <a className="waves-effect waves-light btn-large disabled follow">
          Log in to report ({this.state.suspectInfo.votes.length})
        </a>
      );
    } else if (
      this.state.suspectInfo.votes.indexOf(this.props.auth.steamId) > -1
    ) {
      return (
        <a
          className="waves-effect waves-light btn-large grey lighten-2 follow black-text"
          onClick={this.unfollowSuspect}>
          Remove Report (
          {this.state.suspectInfo.votes.length}
          )
        </a>
      );
    } else {
      return (
        <a
          className="waves-effect waves-light btn-large orange accent-2  follow black-text"
          onClick={this.followSuspect}>
          Report (
          {this.state.suspectInfo.votes.length}
          )
        </a>
      );
    }
  }

  renderNoProfileFound() {
    return (
      <div className="row vertical-align">
        <div className="col s6 offset-s3 ">
          <div className="card blue-grey darken-2">
            <div className="card-content main-text">
              <span className="card-title">Whoops!</span>
              <p>
                Looks like this steam user isnt in our database (yet). If you
                like, you can add him below. Please make sure the SteamID you
                entered is valid. Thank you!
              </p>
            </div>
            <div className="card-action">{this.renderCardMessage()}</div>
          </div>
        </div>
      </div>
    );
  }

  renderCardMessage() {
    if (this.props.auth) {
      return (
        <div className="row">
          <div className="col s8">
            <b className="secondary-text">
              Remember to only add TOXIC Steam users.
            </b>
          </div>
          <div className="col s4">
            <button
              className="btn waves-effect waves-light teal lighten-2 center-align"
              type="submit"
              name="action"
              onClick={this.addUser}>
              Add User
              <i className="material-icons right">send</i>
            </button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col s12">
            <b className="white-text">
              You need to be logged into your steam account in order to add
              users.
            </b>
          </div>
        </div>
      );
    }
  }

  renderLoading() {
    return <Loading />;
  }
  renderContent() {
    switch (this.state.suspectInfo) {
      case null:
        return <div className="wrapper">{this.renderLoading()}</div>;
      case false:
        return <div className="wrapper">{this.renderNoProfileFound()}</div>;
      default:
        return <div className="wrapper">{this.renderProfile()}</div>;
    }
  }

  //VERY IMPORTANT FOR SEARCH_BAR
  useSearchBar(path) {
    this.props.history.push(path);
    this.setState({ suspectInfo: null, sentRequest: false }, () => {
      const { id } = this.props.match.params;
      axios.get(`/api/suspects/${id}`).then(response => {
        this.setState({ suspectInfo: response.data, sentRequest: false });
      });
    });
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
}

function mapStateToProps({ auth }) {
  return { auth };
}
export default connect(
  mapStateToProps,
  null
)(Profile);
