import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from 'axios';

class CommentSection extends Component {
  constructor(props) {
    super(props);
    this.state = { input: '', comments: this.props.comments };
    this.userHasComment = this.userHasComment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderCommentInput = this.renderCommentInput.bind(this);
    this.renderComments = this.renderComments.bind(this);
    this.renderIndividualComments = this.renderIndividualComments.bind(this);
    this.handleCommentAction = this.handleCommentAction.bind(this);
    this.renderStar = this.renderStar.bind(this);
    this.likeComment = this.likeComment.bind(this);
    this.unlikeComment = this.unlikeComment.bind(this);
    this.commentsHaveChanged = this.commentsHaveChanged.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.commentsHaveChanged(prevProps.comments)) {
      this.setState({ input: '', comments: this.props.comments });
    }
  }

  commentsHaveChanged(oldComments) {
    const currentComments = this.props.comments;
    if (currentComments.length !== oldComments.length) {
      return true;
    } else {
      for (let i = 0; i < currentComments.length; i++) {
        for (let j = 0; j < oldComments.length; j++) {
          if (
            currentComments[i].participants.length !==
            oldComments[j].participants.length
          ) {
            return true;
          }
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
            <div className="col s2 ">
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

  async handleSubmit(event) {
    event.preventDefault();
    const sent = await axios.post(`/api/suspects/${this.props.uri}/comments`, {
      owner: this.props.auth.steamId,
      text: this.state.input
    });

    if (sent) {
      this.props.changeProfile(sent.data);
    }
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  renderCommentInput() {
    if (this.state.comments) {
      if (!this.props.auth) {
        return <div />;
      } else if (this.userHasComment()) {
        return (
          <div className="row">
            <div className="col s12">
              You already posted a comment on this user.
            </div>
          </div>
        );
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
        <div className="row">
          <ul className="collection">{this.renderIndividualComments()}</ul>
        </div>
      );
    } else {
      return <div>No comments at the moment.</div>;
    }
  }

  async handleCommentAction() {
    let request = await axios.delete(
      `/api/suspects/${this.props.uri}/comments`,
      {
        data: {
          owner: this.props.auth.steamId
        }
      }
    );
    if (request) {
      this.props.changeProfile(request.data);
    }
  }

  renderStar(element) {
    if (element.participants.indexOf(this.props.auth.steamId) > -1) {
      return (
        <a onClick={this.unlikeComment}>
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
  }

  async unlikeComment(comment) {
    let request = await axios.delete(
      `/api/suspects/${this.props.uri}/comments/like`,
      { data: { owner: this.props.auth.steamId } }
    );
    if (request) {
      this.props.changeProfile(request.data);
    }
  }

  async likeComment(comment) {
    let request = await axios.post(
      `/api/suspects/${this.props.uri}/comments/like`,
      { owner: this.props.auth.steamId }
    );
    if (request) {
      this.props.changeProfile(request.data);
    }
  }
  renderIndividualComments() {
    let commentList = this.state.comments.map(element => {
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

          <a onClick={this.handleCommentAction} className="secondary-content">
            <i className="material-icons clicky-trash waves-effect">delete</i>
          </a>
        </li>
      );
    });
    return commentList;
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  null
)(CommentSection);
