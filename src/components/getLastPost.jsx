import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function GetLastPost() {
  const [posts, setPosts] = useState([]);
  const { currentUser, loadingInitial } = useAuth(); // Also get loadingInitial to handle async state

  const authorId = currentUser.id;
  const publishedPosts = posts.filter((post) => post.published);
  const draftPosts = posts.filter((post) => !post.published);

  const lastPost = [...publishedPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  const lastDraft = [...draftPosts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )[0];

  console.log(lastPost);
  console.log(lastDraft);

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
    <>
      {lastPost ? (
        <div className="dashboard-item">
          <Link to={`/dashboard/posts/${lastPost.id}`}>
            <p>{lastPost.title}</p>
          </Link>
        </div>
      ) : (
        <p>No published posts yet.</p>
      )}

      {lastDraft ? (
        <div className="dashboard-item">
          <Link to={`/dashboard/drafts/${lastDraft.id}`}>
            {lastDraft.title}
          </Link>
        </div>
      ) : (
        <p>No drafts yet.</p>
      )}
    </>
  );
}

export default GetLastPost;
