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

  const { currentUser, loadingInitial } = useAuth(); // Also get loadingInitial to handle async state

  // Handle the initial loading state (checking token in localStorage)
  if (loadingInitial) {
    return <p>Loading user information...</p>;
  }

  // Check if there is a logged-in user
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
        // Title already exists
        const data = await response.json();
        setErrorMessage(data.message); // Set this in your local state
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();
      console.log("Post created successfully:", newPost);

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
        // Title already exists
        const data = await response.json();
        setErrorMessage(data.message);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to save draft");
      }

      const newPost = await response.json();
      console.log("Draft saved successfully:", newPost);

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
              autoFocus
              aria-required="true"
              rows={25}
            ></textarea>
          </div>
          <button type="submit">Publish</button>
          <button onClick={handleSaveDraft} type="button">
            Save as draft
          </button>
          <button onClick={handleCancelSubmit}>Cancel</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </fieldset>
      </form>
    </div>
  );
}

export default CreatePost;
