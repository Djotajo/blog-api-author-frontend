import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const postId = uuidv4();
  const [postTitle, setPostTitle] = useState("New Post");
  const [post, setPost] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");

  const { currentUser, loadingInitial } = useAuth();
  if (loadingInitial) {
    return <p>Loading user information...</p>;
  }

  if (!currentUser || !currentUser.isAuthenticated) {
    return <p>You are not logged in.</p>;
  }

  const handlePublish = async (e) => {
    e.preventDefault();

    const postData = {
      id: postId,
      title: postTitle,
      text: post,
      published: true,
    };

    try {
      const apiEndpoint = `http://localhost:3000/dashboard/posts`;

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 409) {
        const data = await response.json();
        setErrorMessage(data.message);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      setPost("");
      navigate(`/dashboard/posts/`);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();

    const postData = {
      id: postId,
      title: postTitle,
      text: post,
      published: false,
    };

    try {
      const apiEndpoint = `http://localhost:3000/dashboard/posts`;

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (response.status === 409) {
        const data = await response.json();
        setErrorMessage(data.message);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to save draft");
      }

      setPost("");
      navigate(`/dashboard/drafts`);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleCancelSubmit = async (event) => {
    event.preventDefault();
    navigate(`/`);
  };

  return (
    <div className="new-post-fullscreen">
      <form onSubmit={handlePublish} className="post-form">
        <fieldset>
          <div>
            <label htmlFor="postTitle">Title: </label>
            <input
              type="text"
              id="postTitle"
              name="postTitle"
              onChange={(e) => setPostTitle(e.target.value)}
              required
              autoFocus
              aria-required="true"
            />
            <label htmlFor="post">Post: </label>
            <textarea
              id="post"
              name="post"
              onChange={(e) => setPost(e.target.value)}
              required
              aria-required="true"
            ></textarea>
          </div>
          <div className="button-row">
            <button type="submit">Publish</button>
            <button type="button" onClick={handleSaveDraft}>
              Save as draft
            </button>
            <button onClick={handleCancelSubmit}>Cancel</button>
          </div>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </fieldset>
      </form>
    </div>
  );
}

export default CreatePost;
