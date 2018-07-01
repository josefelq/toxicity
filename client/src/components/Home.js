import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { steamID: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ steamID: event.target.value });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const search = await axios.post('/api/suspects/search', {
      uri: this.state.steamID
    });
    if (search.data) {
      this.props.history.push(`/suspects/${search.data.theId}`);
    } else {
      alert('No steam user does not exist!');
    }
  }

  renderContent() {
    const styles = {
      backgroundColor: 'white',
      color: 'black'
    };
    switch (this.props.auth) {
      case null:
        return;
      default:
        return (
          <div className="row vertical-align">
            <div className="col l8 offset-l2">
              <nav className="blue-grey lighten-5 z-depth-5">
                <div className="nav-wrapper">
                  <form onSubmit={this.handleSubmit}>
                    <div className="input-field">
                      <input
                        className="center big-search"
                        id="search"
                        placeholder="Steam Profile URL or SteamID64."
                        type="search"
                        required
                        style={styles}
                        value={this.state.steamID}
                        onChange={this.handleChange}
                      />
                      <div className="center-align">
                        <button className="waves-effect waves-light btn-large search-button blue-grey darken-3">
                          Search
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </nav>
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <div className="wrapper">
        <Header needsHeader={false} />
        <main>{this.renderContent()}</main>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Home);
