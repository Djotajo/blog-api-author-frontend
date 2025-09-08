import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeletePost from "./deletePost";
import { useNavigate } from "react-router-dom";

function EditPost() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [published, setPublished] = useState(true);
  const { currentUser, loadingInitial } = useAuth(); // Also get loadingInitial to handle async state
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");

  useEffect(() => {
    async function fetchPostData() {
      console.log(postId);
      const response = await fetch(
        `http://localhost:3000/dashboard/posts/${postId}`
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

  const handleCheckboxChange = (e) => {
    setPublished(e.target.checked);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    const postData = {
      id: postId,
      title: postTitle,
      text: postText,
      published: published,
    };

    try {
      const apiEndpoint = `http://localhost:3000/dashboard/posts/${postId}`;

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to edit post");
      }

      const newPost = await response.json();
      console.log("Post edited successfully:", newPost);
      navigate(`/`);

      setPost("");
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const handleCancelSubmit = async (event) => {
    event.preventDefault();
    navigate(`/dashboard/posts`);
  };

  return (
    <>
      <div className="edit-draft-fullscreen">
        <form onSubmit={handleSaveEdit} className="post-form">
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
              <label htmlFor="publish">Published: </label>
              <input
                type="checkbox"
                id="publish"
                checked={published}
                onChange={handleCheckboxChange}
              />

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
            <button type="submit">Save changes</button>
            <button onClick={handleCancelSubmit}>Cancel</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </fieldset>
        </form>
        <DeletePost postObject={post} />
      </div>
    </>
  );
}

export default EditPost;
