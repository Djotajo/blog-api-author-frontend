import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import FormatPostDate from "./formatPostDate";
import PostComment from "./postComment";
import EditComment from "./editComment";
import DeleteComment from "./deleteComment";
import { useAuth } from "../context/AuthContext";
import DeletePost from "./deletePost";

function GetPost() {
  const [authorData, setAuthorData] = useState(null);
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const { currentUser, loadingInitial } = useAuth(); // Also get loadingInitial to handle async state

  useEffect(() => {
    async function fetchPostData() {
      const response = await fetch(`http://localhost:3000/posts/${postId}`);
      const responseJson = await response.json();
      setAuthorData(responseJson);
      setPost(responseJson);
    }

    fetchPostData();
  }, [post]);

  const paragraphs = useMemo(() => {
    return post?.text ? post.text.split("\n\n") : [];
  }, [post?.text]);

  if (!post) {
    return <div className="post">Loading or Post not found...</div>;
  }
  console.log(post);
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
            {authorData.username} on {FormatPostDate(post.createdAt)}
          </p>
          {currentUser && authorData.id === currentUser.id ? (
            <>
              {/* <EditComment commentObject={comment} key={comment.id} /> */}
              <DeletePost postObject={post} />
            </>
          ) : (
            `Log in user to edit`
          )}
          <p>Comments: {post.Comment.length}</p>
        </section>

        <section className="comment-form">
          <h3>Add a comment</h3>
          <PostComment />
        </section>
        <section
          className="comments-section"
          aria-labelledby="comments-heading"
        >
          <h2 id="comments-heading">Comments</h2>
          {post.Comment.map((comment, index) => (
            <article key={comment.id || index} className="comment">
              <header>
                <p>{comment.id}</p>
                <cite className="comment-author">
                  {comment.commentByAuthor
                    ? comment.commentByAuthor.username
                    : comment.commentByUser.username}
                </cite>
                <time dateTime={comment.createdAt} className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </header>
              <p className="comment-content">{comment.text}</p>
              {/* provjeriti */}
              {comment.commentByUser ? (
                currentUser && comment.commentByUser.id === currentUser.id ? (
                  <>
                    <EditComment commentObject={comment} key={comment.id} />
                    <DeleteComment commentObject={comment} />
                  </>
                ) : (
                  `Log in user to edit`
                )
              ) : currentUser &&
                comment.commentByAuthor.id === currentUser.id ? (
                <EditComment commentObject={comment} />
              ) : (
                "Log in to edit"
              )}
              {/* {currentUser && comment.commentByUser.id === currentUser.id ? (
                <EditComment commentObject={comment} />
              ) : (
                "Log in to edit"
              )} */}
            </article>
          ))}
        </section>
      </div>
    </>
  );
}

export default GetPost;
