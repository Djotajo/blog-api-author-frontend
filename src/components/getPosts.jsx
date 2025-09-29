import { useEffect, useState } from "react";
import FormatPostDate from "./formatPostDate.jsx";
import { Link } from "react-router-dom";
import { useApiUrl } from "../context/ApiUrlContext";

function GetPosts({
  authorId = undefined,
  showPosts = false,
  showDrafts = false,
}) {
  const [posts, setPosts] = useState([]);

  const publishedPosts = posts.filter((post) => post.published);
  const draftPosts = posts.filter((post) => !post.published);
  const apiUrl = useApiUrl();

  useEffect(() => {
    async function fetchPostData() {
      const token = localStorage.getItem("jwt_token");
      const res = await fetch(`${apiUrl}/dashboard/posts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const posts = await res.json();

      setPosts(posts);
    }

    fetchPostData();
  }, [authorId]);

  return (
    <>
      {showDrafts && (
        <div className="posts">
          <h1>Your Drafts</h1>
          <ul>
            {draftPosts.map((post) => (
              <li key={post.id} className="posts-list-item">
                {" "}
                <article className="post">
                  <h2>
                    <Link to={`/dashboard/drafts/${post.id}`}>
                      {post.title}
                    </Link>
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
      )}
      {showPosts && (
        <div className="posts">
          <h1>Your Posts</h1>
          <ul>
            {publishedPosts.map((post) => (
              <li key={post.id} className="posts-list-item">
                {" "}
                <article className="post">
                  <h2>
                    <Link to={`/dashboard/posts/${post.id}`}>{post.title}</Link>
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
      )}
    </>
  );
}

export default GetPosts;
