import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeletePost from "./deletePost";
import { useNavigate } from "react-router-dom";

function GetDraft() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const { currentUser, loadingInitial } = useAuth(); // Also get loadingInitial to handle async state
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    async function fetchPostData() {
      const response = await fetch(
        `http://localhost:3000/dashboard/drafts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseJson = await response.json();
      setPost(responseJson);
      setPostTitle(responseJson.title);
      setPostText(responseJson.text);
    }

    fetchPostData();
  }, [postId]);

  if (!post) {
    return <div className="post">Loading or Post not found...</div>;
  }

  const handlePublish = async (e) => {
    e.preventDefault();

    const postData = {
      id: postId,
      title: postTitle,
      text: postText,
      published: true,
      createdAt: new Date(),
    };

    try {
      const apiEndpoint = `http://localhost:3000/dashboard/drafts/${postId}`;

      const response = await fetch(apiEndpoint, {
        method: "PUT",
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
      text: postText,
      published: false,
      createdAt: new Date(),
    };

    try {
      const apiEndpoint = `http://localhost:3000/dashboard/drafts/${postId}`;

      const response = await fetch(apiEndpoint, {
        method: "PUT",
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
      console.log("Draft saved successfully:");

      setPost("");
      navigate(`/dashboard/drafts`);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleCancelSubmit = async (event) => {
    event.preventDefault();
    navigate(`/dashboard/drafts`);
  };

  return (
    <>
      <div className="edit-draft-fullscreen">
        <form onSubmit={handlePublish} className="post-form">
          <fieldset>
            <div>
              <label htmlFor="postTitle">Title: </label>
              <input
                type="text"
                id="postTitle"
                name="postTitle"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                required
                autoFocus
                aria-required="true"
              />
              <label htmlFor="post">Post: </label>
              <textarea
                id="postText"
                name="postText"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
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
      <DeletePost postObject={post} />
    </>
  );
}

export default GetDraft;
