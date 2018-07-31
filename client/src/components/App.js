import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';

import Home from './Home';
import NoMatch from './NoMatch';
import Profile from './profile/Profile';
import Account from './Account';
import Leaderboard from './Leaderboard';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="wrapper">
        <BrowserRouter>
          <Switch>
            <Route component={Leaderboard} path="/leaderboards" exact />
            <Route component={Profile} path="/suspects/:id" exact />
            <Route component={Account} path="/account/:id" exact />
            <Route component={Home} path="/" exact />
            <Route component={NoMatch} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(
  null,
  actions
)(App);
