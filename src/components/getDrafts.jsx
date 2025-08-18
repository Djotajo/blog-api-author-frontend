import { useEffect, useState } from "react";
import FormatPostDate from "./formatPostDate.jsx";
import { Link } from "react-router-dom";

function GetDrafts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPostData() {
      const response = await fetch(`http://localhost:3000/posts/drafts/`);
      const responseJson = await response.json();
      setPosts(responseJson);
      console.log(posts);
    }

    fetchPostData();
  }, []);

  return (
    <>
      <div className="hero">
        <div className="hero-left"></div>
        <div className="hero-right">
          <h2>Just another random blog for TOP</h2>
        </div>
      </div>

      <div className="posts">
        <h1>Posts</h1>
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
