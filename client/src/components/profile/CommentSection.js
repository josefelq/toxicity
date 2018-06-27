import React, { Component } from 'react';
import { connect } from 'react-redux';

class CommentSection extends Component {
  constructor(props) {
    super(props);
    this.state = { input: '' };
    this.userHasComment = this.userHasComment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    return this.props.comments.find(
      element => element.ownerSteam === this.props.auth.steamId
    );
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.input);
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  renderCommentInput() {
    if (this.props.comments) {
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
    if (this.props.comments.length) {
      return <ul className="collection">{this.renderIndividualComments()}</ul>;
    } else {
      return;
    }
  }

  renderIndividualComments() {
    let commentList = this.props.comments.map(element => {
      return (
        <li className="collection-item avatar" key={element._id}>
          <img
            src="https://image.flaticon.com/icons/svg/747/747376.svg"
            alt="User Avatar"
            className="responsive-img circle"
          />
          <span className="title">Title</span>
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
