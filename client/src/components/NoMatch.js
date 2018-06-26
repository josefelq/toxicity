import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NoMatch extends Component {
  render() {
    return (
      <div className="wrapper">
        <main>
          <div className="wrapper valign-wrapper">
            <div className="row">
              <h1>404 Not Found :(</h1>
              <p>
                Time to go back{' '}
                <Link to="/" id="go-back-home">
                  Home
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default NoMatch;