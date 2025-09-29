import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeletePost from "./deletePost";
import { useNavigate } from "react-router-dom";
import { useApiUrl } from "../context/ApiUrlContext";

function GetDraft() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");
  const apiUrl = useApiUrl();

  useEffect(() => {
    async function fetchPostData() {
      const response = await fetch(`${apiUrl}/dashboard/drafts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        const data = await response.json();
        setErrorMessage(data.message);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      setPost("");
      navigate(`/dashboard/posts/`);
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage(error.message);
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
        const data = await response.json();
        setErrorMessage(data.message);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save draft");
      }

      setPost("");
      navigate(`/dashboard/drafts`);
    } catch (error) {
      console.error("Error saving draft:", error);
      setErrorMessage(error.message);
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
              ></textarea>
            </div>
            <div className="button-row">
              <button type="submit">Publish</button>
              <button onClick={handleSaveDraft} type="button">
                Save as draft
              </button>
              <button onClick={handleCancelSubmit}>Cancel</button>
              <DeletePost postObject={post} />
            </div>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </fieldset>
        </form>
      </div>
    </>
  );
}

export default GetDraft;
