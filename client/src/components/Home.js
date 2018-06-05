import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';

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
    const steamSearch = this.state.steamID.replace(/\s+/g, '');
    //this is a url
    if (steamSearch.includes('http')) {
      const userId = steamSearch.replace(
        'https://steamcommunity.com/profiles/',
        ''
      );
      let i = 0;
      for (; i < userId.length; i++) {
        if (userId.charAt(i) === '/') {
          break;
        }
      }
      const finalUserId = userId.substring(0, i + 1);
      this.props.history.push(`/suspects/${finalUserId}`);
    } else {
      //it's a number
      this.props.history.push(`/suspects/${steamSearch}`);
    }
  }

  renderContent() {
    const styles = {
      backgroundColor: '#607d8b',
      color: 'white'
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
                        id="search"
                        placeholder="SteamID64 (e.g. 76561198195244371) or URL (e.g. https://steamcommunity.com/profiles/76561198195244371)"
                        type="search"
                        required
                        style={styles}
                        value={this.state.steamID}
                        onChange={this.handleChange}
                        autoComplete="off"
                      />
                      <div className="center-align">
                        <button className="waves-effect waves-light btn-large search-button">
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
        <Header />
        <main>{this.renderContent()}</main>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Home);
