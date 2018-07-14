import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import Footer from './Footer';

class Home extends Component {
  constructor(props) {
    super(props);
    this.useSearchBar = this.useSearchBar.bind(this);
  }

  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return this.renderWelcome();
      default:
        return this.renderWelcome();
    }
  }

  renderWelcome() {
    return (
      <div className="container content main-text big-text">
        <div className="row center">
          <div className="col s12 add-margin">
            Tired of <b className="contrast">TOXIC</b> players ruining your
            games?
          </div>
          <div className="col s12 add-margin">
            <b className="contrast">REPORT</b> them.
          </div>
          <div className="col s12 add-margin">
            <b className="contrast">TRACK</b> them.
          </div>
          <div className="col s12 add-margin">But most importantly . . .</div>
          <div className="col s12 add-margin">
            <b>HELP</b> others <i class="fas fa-grin-beam" />.
          </div>
        </div>
      </div>
    );
  }

  //VERY IMPORTANT FOR SEARCH_BAR
  useSearchBar(path) {
    this.props.history.push(path);
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

export default connect(mapStateToProps)(Home);
