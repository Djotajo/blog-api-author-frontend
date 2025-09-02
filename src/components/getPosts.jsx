import { useEffect, useState } from "react";
import FormatPostDate from "./formatPostDate.jsx";
import { Link } from "react-router-dom";

function GetPosts({ authorId = undefined, showPublished = true }) {
  const [posts, setPosts] = useState([]);

  const publishedPosts = posts.filter((post) => post.published);
  const draftPosts = posts.filter((post) => !post.published);

  useEffect(() => {
    async function fetchPostData() {
      const url = authorId
        ? `http://localhost:3000/posts/drafts/${authorId}`
        : `http://localhost:3000/posts/`;
      const response = await fetch(url);
      const responseJson = await response.json();
      console.log("ovdje isto ok");
      console.log(responseJson);
      setPosts(responseJson);
    }

    fetchPostData();
  }, [authorId]);

  return (
    <>
      <div className="posts">
        <h1>Your Drafts</h1>
        <ul>
          {draftPosts.map((post) => (
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
      {showPublished && (
        <div className="posts">
          <h1>Your Posts</h1>
          <ul>
            {publishedPosts.map((post) => (
              <li key={post.id} className="posts-list-item">
                {" "}
                <article className="post">
                  <h2>
                    <Link to={`/posts/${post.id}`}>{post.title}</Link>
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
