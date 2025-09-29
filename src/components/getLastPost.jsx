import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FormatPostDate from "./formatPostDate.jsx";
import { useApiUrl } from "../context/ApiUrlContext";

function GetLastPost() {
  const [posts, setPosts] = useState([]);
  const { currentUser, loadingInitial } = useAuth();
  const authorId = currentUser.id;
  const publishedPosts = posts.filter((post) => post.published);
  const draftPosts = posts.filter((post) => !post.published);
  const apiUrl = useApiUrl();

  const lastPost = [...publishedPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  const lastDraft = [...draftPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  useEffect(() => {
    async function fetchPostData() {
      const token = localStorage.getItem("jwt_token");

      const url = `${apiUrl}/dashboard/posts`;
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
    <>
      {lastPost ? (
        <Link to={`/dashboard/posts/${lastPost.id}`} className="dashboard-item">
          <div className="dashboard-item-header">Latest Post</div>
          <div className="dashboard-item-content">
            {" "}
            <h4>{lastPost.title}</h4>
            <p className="draft-snippet">{lastPost.text.slice(0, 100)}...</p>
            <p>{FormatPostDate(lastPost.createdAt)}</p>
          </div>
        </Link>
      ) : (
        <p>No published posts yet.</p>
      )}

      {lastDraft ? (
        <Link
          to={`/dashboard/drafts/${lastDraft.id}`}
          className="dashboard-item"
        >
          <div className="dashboard-item-header">Latest Draft</div>
          <div className="dashboard-item-content">
            <h4>{lastDraft.title}</h4>
            <p className="draft-snippet">{lastDraft.text.slice(0, 100)}...</p>

            <p>{FormatPostDate(lastPost.createdAt)}</p>
          </div>
        </Link>
      ) : (
        <p>No drafts yet.</p>
      )}
    </>
  );
}

export default GetLastPost;
