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
  const { currentUser, loadingInitial } = useAuth(); // Also get loadingInitial to handle async state
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPostData() {
      const response = await fetch(`http://localhost:3000/posts/${postId}`);
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

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    const postData = {
      id: postId,
      title: postTitle,
      text: postText,
      //   authorId je samo test, treba staviti userId
      authorId: currentUser.id,
      published: false,

      //   userId: currentUser.id,
    };

    console.log(postData);

    try {
      const apiEndpoint = `http://localhost:3000/posts/${postId}/edit`;

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
            {/* <button onClick={handleSaveDraft} type="button">
            Unpublish post
          </button> */}
            <button>Cancel</button>
            {/* onClick={handleCancelSubmit} */}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </fieldset>
        </form>
        <DeletePost postObject={post} />
      </div>
    </>
  );
}

export default EditPost;
