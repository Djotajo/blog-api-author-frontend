import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function PostComment() {
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("jwt_token");

  const [errorMessage, setErrorMessage] = useState("");

  const { postId } = useParams();

  const { currentUser, loadingInitial } = useAuth();
  const navigate = useNavigate();

  if (loadingInitial) {
    return <p>Loading user information...</p>;
  }

  if (!currentUser || !currentUser.isAuthenticated) {
    return <p>You are not logged in.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const commentData = {
      text: comment,
      authorId: currentUser.id,
      parentId: postId,
    };

    console.log(commentData);

    try {
      const apiEndpoint = `http://localhost:3000/dashboard/posts/${postId}/comments`;

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const newComment = await response.json();
      console.log("Comment added successfully:", newComment);

      setComment("");
      navigate(0);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="comment-form">
        <fieldset>
          <div>
            <label htmlFor="comment">Comment: </label>
            <textarea
              id="comment"
              name="comment"
              onChange={(e) => setComment(e.target.value)}
              required
              autoFocus
              aria-required="true"
            ></textarea>
          </div>
          <button type="submit">Submit</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </fieldset>
      </form>
    </>
  );
}

export default PostComment;
