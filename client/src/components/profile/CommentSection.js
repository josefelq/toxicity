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
  }

  render() {
    return (
      <div className="row comment-section z-depth-4">
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
      this.props.addComment(sent.data);
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
        return <div>Ya tiene un comment</div>;
      } else {
        return (
          <div className="row">
            <form className="col s12" onSubmit={this.handleSubmit}>
              <div className="row comment-input">
                <div className="input-field col s12">
                  <textarea
                    id="textarea2"
                    className="materialize-textarea"
                    maxLength="120"
                    value={this.state.input}
                    onChange={this.handleChange}
                  />
                  <label htmlFor="textarea2">Your comment</label>
                </div>
              </div>
              <div className="row">
                <div className="col s2 offset-s10">
                  <button
                    className="btn waves-effect waves-light comment-button"
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
    if (this.state.comments.length) {
      return <ul className="collection">{this.renderIndividualComments()}</ul>;
    } else {
      return;
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
          <span className="title">{element.steamName}</span>
          <p>{element.text}</p>
          <a href="#!" className="secondary-content">
            <i className="material-icons">grade</i>
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
