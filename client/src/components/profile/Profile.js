import React, { Component } from 'react';
import Header from '../Header';
import { connect } from 'react-redux';
import axios from 'axios';

import Loading from '../Loading';
import CommentSection from './CommentSection';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { suspectInfo: null, steamInfo: null };
    this.addUser = this.addUser.bind(this);
    this.followSuspect = this.followSuspect.bind(this);
    this.unfollowSuspect = this.unfollowSuspect.bind(this);
  }

  followSuspect() {
    const { id } = this.props.match.params;
    axios
      .post(`/api/suspects/${id}/follow`, {
        owner: this.props.auth.steamId
      })
      .then(response => {
        if (response.data === true) {
          this.setState({ suspectInfo: null });
          axios.get(`/api/suspects/${id}`).then(response2 => {
            this.setState({ suspectInfo: response2.data });
          });
        }
      });
  }

  unfollowSuspect() {
    const { id } = this.props.match.params;
    axios
      .post(`/api/suspects/${id}/unfollow`, {
        owner: this.props.auth.steamId
      })
      .then(response => {
        if (response.data === true) {
          this.setState({ suspectInfo: null });
          axios.get(`/api/suspects/${id}`).then(response2 => {
            this.setState({ suspectInfo: response2.data });
          });
        }
      });
  }

  addUser() {
    this.setState({ suspectInfo: null });
    const { id } = this.props.match.params;
    axios.post('/api/suspects', { steamId: id }).then(response => {
      this.setState({ suspectInfo: response.data });
    });
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    axios.get(`/api/suspects/${id}`).then(response => {
      this.setState({ suspectInfo: response.data });
      axios.get(`/api/suspects/${id}/steam`).then(response => {
        this.setState({ steamInfo: response.data });
      });
    });
  }
  renderProfile() {
    if (this.state.steamInfo && this.state.suspectInfo) {
      return (
        <div className="container content">
          <div className="row suspect-info z-depth-4">
            <div className="col s3">
              <img
                className="responsive-img circle"
                src={this.state.steamInfo.avatarfull}
                alt="avatar of user"
              />
            </div>
            <div className="col s4">
              <div className="row">
                <div className="col">
                  <h3>{this.state.steamInfo.personaname}</h3>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <p>
                    <b>SteamID:</b> {this.state.steamInfo.steamid}
                  </p>
                </div>
              </div>
            </div>
            <div className="col s4">{this.renderFollowButton()}</div>
          </div>
          <CommentSection comments={this.state.suspectInfo.comments} />
        </div>
      );
    }
  }

  renderFollowButton() {
    if (!this.props.auth) {
      return (
        <a className="waves-effect waves-light btn-large disabled follow">
          Log in to start following!
        </a>
      );
    } else if (
      this.state.suspectInfo.votes.indexOf(this.props.auth.steamId) > -1
    ) {
      return (
        <a
          className="waves-effect waves-light btn-large red follow"
          onClick={this.unfollowSuspect}>
          Unfollow
        </a>
      );
    } else {
      return (
        <a
          className="waves-effect waves-light btn-large green follow"
          onClick={this.followSuspect}>
          Follow
        </a>
      );
    }
  }

  renderNoProfileFound() {
    return (
      <div className="row">
        <div className="col s6 offset-s3 no-profile-found">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">Whoops!</span>
              <p>
                Looks like this steam user isnt in our database. If you like,
                you can add him below. Please make sure the SteamID you entered
                is valid. Thank you!
              </p>
            </div>
            <div className="card-action">
              <button
                className="btn waves-effect waves-light"
                type="submit"
                name="action"
                onClick={this.addUser}>
                Add user
                <i className="material-icons right">send</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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

  render() {
    return (
      <div className="wrapper">
        <Header />
        <main>{this.renderContent()}</main>
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
