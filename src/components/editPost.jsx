import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DeletePost from "./deletePost";
import { useNavigate } from "react-router-dom";
import { useApiUrl } from "../context/ApiUrlContext";

function EditPost() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [published, setPublished] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");
  const apiUrl = useApiUrl();

  useEffect(() => {
    async function fetchPostData() {
      const response = await fetch(`${apiUrl}/dashboard/posts/${postId}`, {
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
      createdAt: new Date(),
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit post");
      }

      setPost("");
      navigate(`/dashboard/posts`);
    } catch (error) {
      console.error("Error editing post:", error);
      setErrorMessage(error.message);
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
              <label htmlFor="publish">
                Published:{" "}
                <input
                  type="checkbox"
                  id="publish"
                  checked={published}
                  onChange={handleCheckboxChange}
                />
              </label>
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
              <button type="submit">Save changes</button>
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

export default EditPost;
