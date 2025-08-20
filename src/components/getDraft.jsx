import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import FormatPostDate from "./formatPostDate";
import PostComment from "./postComment";
import EditComment from "./editComment";
import DeleteComment from "./deleteComment";
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

  const handlePublish = async (e) => {
    e.preventDefault();

    const postData = {
      id: postId,
      title: postTitle,
      text: postText,
      //   authorId je samo test, treba staviti userId
      authorId: currentUser.id,
      published: true,
      //   userId: currentUser.id,
    };

    console.log(postData);

    try {
      const apiEndpoint = `http://localhost:3000/posts`;

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();
      console.log("Post created successfully:", newPost);

      setPost("");
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
      //   authorId je samo test, treba staviti userId
      authorId: currentUser.id,
      published: false,

      //   userId: currentUser.id,
    };

    console.log(postData);

    try {
      const apiEndpoint = `http://localhost:3000/posts/drafts/${postId}`;

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to save draft");
      }

      const newPost = await response.json();
      console.log("Draft saved successfully:", newPost);
      navigate(`/posts/drafts`);

      setPost("");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  return (
    <>
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
          <button type="submit">Publish</button>
          <button onClick={handleSaveDraft} type="button">
            Save as draft
          </button>
          <button>Cancel</button>
          {/* onClick={handleCancelSubmit} */}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </fieldset>
      </form>
      <DeletePost postObject={post} />
    </>
  );
}

export default GetDraft;
