import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

class CommentSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      comments: this.props.comments,
      ascending: '0',
      karma: '1',
      sentRequest: false
    };
    this.userHasComment = this.userHasComment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCommentAction = this.handleCommentAction.bind(this);
    this.likeComment = this.likeComment.bind(this);
    this.unlikeComment = this.unlikeComment.bind(this);
    this.commentsHaveChanged = this.commentsHaveChanged.bind(this);
    this.handleFilterTypeChange = this.handleFilterTypeChange.bind(this);
    this.handleFilterOrderChange = this.handleFilterOrderChange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.commentsHaveChanged(prevProps.comments)) {
      this.setState({
        input: '',
        comments: this.props.comments
      });
    }
  }

  commentsHaveChanged(oldComments) {
    const currentComments = this.props.comments;
    if (currentComments.length !== oldComments.length) {
      return true;
    } else {
      for (let i = 0; i < currentComments.length; i++) {
        if (
          currentComments[i].participants.length !==
          oldComments[i].participants.length
        ) {
          return true;
        }
      }
      return false;
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col s12">
          <div className="row">
            <div className="col s5 ">
              <h5>Comments</h5>
            </div>
          </div>
          {this.renderCommentInput()}
          <div className="row">
            <div className="col s12">{this.renderComments()}</div>
          </div>
        </div>
      </div>
    );
  }

  userHasComment() {
    return this.state.comments.find(
      element => element.steamId === this.props.auth.steamId
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.sentRequest) {
      this.setState({ sentRequest: true }, async () => {
        const sent = await axios.post(
          `/api/suspects/${this.props.uri}/comments`,
          {
            owner: this.props.auth.steamId,
            text: this.state.input
          }
        );

        if (sent) {
          this.props.changeProfile(sent.data, () => {
            this.setState({ sentRequest: false });
          });
        }
      });
    }
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  renderCommentFilter() {
    return (
      <div className="row">
        <div className="col s2">
          <i className="small material-icons" alt="Filter Comments">
            filter_list
          </i>
        </div>
        <div className="col s5">{this.renderTypeFilter()}</div>
        <div className="col s5">{this.renderTypeOrder()}</div>
      </div>
    );
  }

  handleFilterTypeChange(event) {
    this.setState({ karma: event.target.value });
  }

  handleFilterOrderChange(event) {
    this.setState({ ascending: event.target.value });
  }

  renderTypeOrder() {
    return (
      <select
        className="browser-default"
        defaultValue={this.state.karma ? '0' : '1'}
        onChange={this.handleFilterOrderChange}>
        <option value="0">Descending</option>
        <option value="1">Ascending</option>
      </select>
    );
  }

  renderTypeFilter() {
    return (
      <select
        className="browser-default"
        defaultValue={this.state.karma ? '1' : '0'}
        onChange={this.handleFilterTypeChange}>
        <option value="1">Helpful</option>
        <option value="0">Date</option>
      </select>
    );
  }

  renderCommentInput() {
    if (this.state.comments) {
      if (!this.props.auth) {
        return <div />;
      } else if (this.userHasComment()) {
        return;
      } else {
        return (
          <div className="row comment-section">
            <form className="col s12" onSubmit={this.handleSubmit}>
              <div className="row comment-input">
                <div className="input-field col s12">
                  <textarea
                    id="textarea2"
                    className="materialize-textarea"
                    maxLength="300"
                    value={this.state.input}
                    onChange={this.handleChange}
                  />
                  <label htmlFor="textarea2">Your comment</label>
                </div>
              </div>
              <div className="row">
                <div className="col s2 offset-s10">
                  <button
                    className="btn waves-effect waves-light comment-button blue-grey darken-3"
                    type="submit"
                    name="action">
                    Submit
                    <i className="material-icons right">send</i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        );
      }
    }
  }

  renderComments() {
    if (this.state.comments.length > 0) {
      return (
        <div>
          <div className="row">
            <div className="col s6">
              {this.userHasComment()
                ? 'You already posted a comment here.'
                : ''}
            </div>
            <div className="col s5 offset-s1">{this.renderCommentFilter()}</div>
          </div>
          <div className="row">
            <ul className="collection">{this.renderIndividualComments()}</ul>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row">
          <div className="col s12">
            No comments at the moment. Be the first one to warn others :)
          </div>
        </div>
      );
    }
  }

  //Delete a comment
  async handleCommentAction() {
    if (!this.state.sentRequest) {
      this.setState({ sentRequest: true }, async () => {
        let request = await axios.delete(
          `/api/suspects/${this.props.uri}/comments`,
          {
            data: {
              owner: this.props.auth.steamId
            }
          }
        );
        if (request) {
          this.props.changeProfile(request.data, () => {
            this.setState({ sentRequest: false });
          });
        }
      });
    }
  }

  renderStar(element) {
    if (this.props.auth) {
      if (element.participants.indexOf(this.props.auth.steamId) > -1) {
        return (
          <a
            onClick={() => {
              this.unlikeComment(element);
            }}>
            <i className="material-icons clicky-star waves-effect">favorite</i>
          </a>
        );
      } else {
        return (
          <a
            onClick={() => {
              this.likeComment(element);
            }}>
            <i className="material-icons clicky-star waves-effect">
              favorite_border
            </i>
          </a>
        );
      }
    } else {
      return;
    }
  }

  async unlikeComment(comment) {
    if (!this.state.sentRequest) {
      this.setState({ sentRequest: true }, async () => {
        let request = await axios.delete(`/api/comments/${comment._id}`, {
          data: { owner: this.props.auth.steamId }
        });
        if (request) {
          this.props.changeProfile(request.data, () => {
            this.setState({ sentRequest: false });
          });
        }
      });
    }
  }

  async likeComment(comment) {
    if (!this.state.sentRequest) {
      this.setState({ sentRequest: true }, async () => {
        let request = await axios.post(`/api/comments/${comment._id}`, {
          owner: this.props.auth.steamId
        });
        if (request) {
          this.props.changeProfile(request.data, () => {
            this.setState({ sentRequest: false });
          });
        }
      });
    }
  }

  getComparisonFunction() {
    if (this.state.karma === '1') {
      return (a, b) => {
        if (a.participants.length < b.participants.length) {
          return -1;
        }
        if (a.participants.length > b.participants.length) {
          return 1;
        }
        return 0;
      };
    } else {
      return (a, b) => {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      };
    }
  }

  renderIndividualComments() {
    let commentList = this.state.comments;

    let sortedList = commentList.sort(this.getComparisonFunction());

    if (this.state.ascending === '0') {
      sortedList.reverse();
    }

    let finalList = sortedList.map(element => {
      return (
        <li className="collection-item avatar" key={element._id}>
          <img
            src={element.steamAvatar}
            alt="User Avatar"
            className="responsive-img circle"
          />
          <span className="title comment-user">
            <p>
              <b>{element.steamName}</b>
              &nbsp; &nbsp;
              <small>{element.date} </small>
            </p>
          </span>
          <p>
            {element.text}
            <br />
            {this.renderStar(element)}
            <small>
              {element.participants.length} user(s) have found this comment
              helpful.
            </small>
          </p>
          {this.renderTrashIcon(element)}
        </li>
      );
    });
    return finalList;
  }

  renderTrashIcon(comment) {
    if (this.props.auth) {
      if (this.props.auth.steamId === comment.steamId) {
        return (
          <a onClick={this.handleCommentAction} className="secondary-content">
            <i className="material-icons clicky-trash waves-effect">delete</i>
          </a>
        );
      } else {
        return;
      }
    } else {
      return;
    }
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  null
)(CommentSection);
