import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Loading from './Loading';
import Header from './Header';
import Footer from './Footer';

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = { suspects: null };
  }

  async componentDidMount() {
    const request = await axios.get('/api/leaderboards');
    if (request) {
      if (request.data[0]) {
        this.setState({ suspects: request.data[0].suspects });
      } else {
        this.setState({ suspects: [] });
      }
    }
  }

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

  renderContent() {
    if (this.state.suspects) {
      return (
        <div className="content container main-text">
          <div className="row">
            <div className="col s12 center">
              <h4>
                Most <b className="contrast">TOXIC</b> players
              </h4>
              <small className="secondary-text">
                The worst of the worst, voted by the community. Updates every 24
                hours.
              </small>
            </div>
            <div className="col s12">{this.renderTable()}</div>
          </div>
        </div>
      );
    } else {
      return <Loading />;
    }
  }

  renderTable() {
    if (this.state.suspects.length > 0) {
      return (
        <table className="row">
          <thead>
            <tr>
              <th className="col s2 center">Position</th>
              <th className="col s5">Player</th>
              <th className="col s5">Reports</th>
            </tr>
          </thead>
          <tbody>{this.renderTableData()}</tbody>
        </table>
      );
    } else {
      return (
        <div className="row vertical-align">
          <div className="col s12 center">
            No users here. We're probably updating the leaderboards.
          </div>
        </div>
      );
    }
  }

  renderTableData() {
    let i = 0;
    let list = this.state.suspects.map(element => {
      i++;
      return (
        <tr key={element._id}>
          <td className="col s2 center">
            <h5>{i}</h5>
          </td>
          <td className="col s10">
            <div className="row">
              <div className="col s6 truncate">
                <h5>
                  <Link
                    to={`/suspects/${element.steamId}`}
                    className="highlight">
                    {element.steamName}
                  </Link>
                </h5>
                <small className="secondary-text">({element.steamId})</small>
              </div>
              <div className="col s4">
                <h5>
                  <b className="contrast">{element.votesLength}</b>
                </h5>
              </div>
              <div className="col s2">
                <img
                  src={element.steamAvatar}
                  alt="Avatar"
                  className="responsive-img circle"
                />
              </div>
            </div>
          </td>
        </tr>
      );
    });
    return list;
  }
}

export default Leaderboard;
