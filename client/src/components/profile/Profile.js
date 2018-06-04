import React, { Component } from 'react';
import Header from '../Header';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import axios from 'axios';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = { suspectInfo: null, steamInfo: null };
    this.addUser = this.addUser.bind(this);
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
          <h5>{this.state.steamInfo.personaname}</h5>
          <img src={this.state.steamInfo.avatarfull} alt="Player avatar" />
          <h6>SteamID: {this.state.suspectInfo.steamId}</h6>
          <h6>Toxic reports: {this.state.suspectInfo.toxicReports}</h6>
          <h6>Griefing reports: {this.state.suspectInfo.griefReports}</h6>
        </div>
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
                onClick={this.addUser}
              >
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
    return (
      <div className="row">
        <div className="preloader-wrapper big active">
          <div className="spinner-layer spinner-blue-only">
            <div className="circle-clipper left">
              <div className="circle" />
            </div>
            <div className="gap-patch">
              <div className="circle" />
            </div>
            <div className="circle-clipper right">
              <div className="circle" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  renderContent() {
    switch (this.state.suspectInfo) {
      case null:
        return (
          <div className="wrapper valign-wrapper">{this.renderLoading()}</div>
        );
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
export default connect(mapStateToProps, actions)(Profile);
