import React, { Component } from "react";
import * as api from "./api";
import CreateComment from "./createComment";
import RemoveComment from "./removeComment";
import VoteUpdater from "./votesUpdater";
import ErrorHandler from "./errorHandler";

class ArticleComments extends Component {
  state = {
    comments: [],
    isLoading: true,
    error: null
  };
  render() {
    const { comments, isLoading, error } = this.state;
    const { loggedInUser } = this.props;

    if (error) return <ErrorHandler error={error} />;
    if (isLoading) return <p>Loading...</p>;
    return (
      <div className="commentsContainer">
        <CreateComment
          postComment={this.postComment}
          loggedInUser={loggedInUser}
        />
        {comments.map(comment => {
          return (
            <ul className="comments" key={comment.comment_id}>
              <li className="commentsList">Author: {comment.author}</li>
              <li className="commentsList commentText">{comment.body}</li>
              <li className="commentsList">
                Date: {new Date(comment.created_at).toLocaleString()}
              </li>
              <VoteUpdater className="commentsList" data={comment} />
              {loggedInUser === comment.author ? (
                <RemoveComment
                  comment_id={comment.comment_id}
                  removeCommentById={this.removeCommentById}
                />
              ) : null}
            </ul>
          );
        })}        
      </div>
    );
  }
  componentDidMount() {
    this.fetchComments();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.comments.length !== prevState.comments.length) {
      this.fetchComments();
    }
  }

  fetchComments = () => {
    const { article_id } = this.props;
    api
      .getArtcilceComments(article_id)
      .then(comments => {
        this.setState({ comments, isLoading: false });
      })
      .catch(error => {
        this.setState({
          error: {
            status: error.response.status,
            msg: error.response.data.msg
          },
          isLoading: false
        });
      });
  };

  postComment = (body, username) => {
    const { article_id } = this.props;
    api
      .postArticleComment(article_id, { body, username })
      .then(comment => {
        this.setState(({ comments }) => {
          return {
            comments: [...comments, comment]
          };
        });
      })
      .catch(error => {
        this.setState({
          error: {
            status: error.response.status,
            msg: error.response.data.msg
          },
          isLoading: false
        });
      });
  };

  removeCommentById = comment_id => {
    api.deleteComment(comment_id).then(() => {
      this.setState(curentState => {
        const newCommentsList = curentState.comments.filter(comment => {
          return comment_id !== comment.comment_id;
        });
        return { comments: newCommentsList };
      });
    });
  };
}

export default ArticleComments;
