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

  handleSubmit(event) {
    event.preventDefault();
    const steamSearch = this.state.steamID.replace(/\s+/g, '');
    this.props.history.push(`/suspects/${steamSearch}`);
  }

  renderContent() {
    const styles = { textAlign: 'center' };
    switch (this.props.auth) {
      case null:
        return;
      default:
        return (
          <div className="wrapper container valign-wrapper">
            <nav className="white z-depth-5">
              <div className="nav-wrapper">
                <form onSubmit={this.handleSubmit}>
                  <div className="input-field">
                    <input
                      id="search"
                      placeholder="SteamID64 (e.g. 76561198195244371)"
                      type="search"
                      required
                      style={styles}
                      value={this.state.steamID}
                      onChange={this.handleChange}
                    />
                    <label className="label-icon" htmlFor="search">
                      <i className="material-icons">search</i>
                    </label>
                    <i className="material-icons">close</i>
                  </div>
                </form>
              </div>
            </nav>
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
