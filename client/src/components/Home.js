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
        return;
      default:
        return <div>hola mundo</div>;
    }
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
