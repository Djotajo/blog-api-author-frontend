import { useEffect, useState } from "react";
import FormatPostDate from "./formatPostDate.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GetDrafts({ authorId = undefined }) {
  const [posts, setPosts] = useState([]);
  const { currentUser, loadingInitial } = useAuth(); // Also get loadingInitial to handle async state

  useEffect(() => {
    async function fetchPostData() {
      if (!currentUser || !currentUser.isAuthenticated) {
        return <p>You are not logged in.</p>;
      }
      const url = authorId
        ? `http://localhost:3000/posts/drafts/${authorId}`
        : `http://localhost:3000/posts/drafts/`;
      // const response = await fetch(`http://localhost:3000/posts/drafts/`);
      const response = await fetch(url);

      const responseJson = await response.json();
      setPosts(responseJson);
    }

    fetchPostData();
  }, [authorId, currentUser]);

  if (loadingInitial) {
    return <p>Loading user information...</p>;
  }

  // Check if there is a logged-in user

  return (
    <>
      <div className="posts">
        <h1>Drafts</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="posts-list-item">
              {" "}
              <article className="post">
                <h2>
                  <Link to={`/posts/drafts/${post.id}`}>{post.title}</Link>
                </h2>{" "}
                <p className="post-text">{post.text}</p>
                <div className="post-footer">
                  {" "}
                  <span>
                    {post.author.username} on {FormatPostDate(post.createdAt)}
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default GetDrafts;
