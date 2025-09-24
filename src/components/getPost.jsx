import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import FormatPostDate from "./formatPostDate";
import PostComment from "./postComment";
import EditComment from "./editComment";
import DeleteComment from "./deleteComment";
import { useAuth } from "../context/AuthContext";
import DeletePost from "./deletePost";
import { Link } from "react-router-dom";

function GetPost() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const { currentUser, loadingInitial } = useAuth();
  useEffect(() => {
    async function fetchPostData() {
      const token = localStorage.getItem("jwt_token");

      const response = await fetch(
        `http://localhost:3000/dashboard/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseJson = await response.json();
      setPost(responseJson);
    }

    fetchPostData();
  }, [postId]);

  const paragraphs = useMemo(() => {
    return post?.text ? post.text.split("\n\n") : [];
  }, [post?.text]);

  if (!post) {
    return <div className="post">Loading or Post not found...</div>;
  }

  return (
    <>
      <div className="full-post">
        <section className="post-content">
          <h1>{post.title}</h1>
          <div>
            {paragraphs.map((p, index) => (
              <p key={index}>{p}</p>
            ))}
          </div>
          <p>
            {post.author.username} on {FormatPostDate(post.createdAt)}
          </p>
          {currentUser && post.author.id === currentUser.id ? (
            <div className="comment-actions">
              <Link to={`/dashboard/posts/${post.id}/edit`} className="btn">
                Edit
              </Link>
              <DeletePost />
            </div>
          ) : (
            `Log in user to edit`
          )}
          <p>Comments: {post.Comment.length}</p>
        </section>

        <section className="full-post-comment-form">
          <PostComment />
        </section>
        <section
          className="full-post-comments-section"
          aria-labelledby="full-post-comments-heading"
        >
          <h2 id="full-post-comments-heading">Comments</h2>
          {post.Comment.map((comment, index) => (
            <article key={comment.id || index} className="full-post-comment">
              <header>
                <cite className="full-post-comment-author">
                  {comment.commentByAuthor
                    ? comment.commentByAuthor.username
                    : comment.commentByUser.username}
                </cite>{" "}
                on{" "}
                <time
                  dateTime={comment.createdAt}
                  className="full-post-comment-date"
                >
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </header>
              <p className="full-post-comment-content">{comment.text}</p>
              {comment.commentByAuthor ? (
                <div className="comment-actions">
                  <EditComment commentObject={comment} key={comment.id} />
                  <DeleteComment commentObject={comment} />
                </div>
              ) : (
                <div className="comment-actions">
                  <DeleteComment commentObject={comment} />
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </>
  );
}

export default GetPost;
