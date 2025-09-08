import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GetStats() {
  const [posts, setPosts] = useState([]);
  const { currentUser, loadingInitial } = useAuth(); // Also get loadingInitial to handle async state

  const authorId = currentUser.id;
  const publishedPosts = posts.filter((post) => post.published);
  const draftPosts = posts.filter((post) => !post.published);
  const max = publishedPosts.length + draftPosts.length;
  console.log(publishedPosts);

  const postHeight = (publishedPosts.length / max) * 100;

  const draftHeight = (draftPosts.length / max) * 100;

  useEffect(() => {
    async function fetchPostData() {
      const token = localStorage.getItem("jwt_token");

      const url = `http://localhost:3000/dashboard/posts`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseJson = await response.json();
      setPosts(responseJson);
    }

    fetchPostData();
  }, [authorId]);

  return (
    // <div className="dashboard-item">
    //   <p>Total posts: {publishedPosts.length}</p>
    //   <p>Total drafts {draftPosts.length}</p>
    // </div>
    <div className="dashboard-item">
      <div className="mini-chart">
        <div className="bar-group">
          <div
            className="bar posts-bar"
            style={{ height: `${postHeight}%` }}
            title={`Posts: ${publishedPosts.length}`}
          >
            <p>{publishedPosts.length}</p>
          </div>
          <span>Posts</span>
        </div>

        <div className="bar-group">
          <div
            className="bar drafts-bar"
            style={{ height: `${draftHeight}%` }}
            title={`Drafts: ${draftPosts.length}`}
          >
            <p>{draftPosts.length}</p>
          </div>
          <span>Drafts</span>
        </div>
      </div>
    </div>
  );
}

export default GetStats;
