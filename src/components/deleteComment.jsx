import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function DeleteComment({ commentObject }) {
  const commentId = commentObject.id;
  const { postId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // provjeriti api endpoint
      const apiEndpoint = `http://localhost:3000/posts/${postId}/${commentId}`;

      const response = await fetch(apiEndpoint, {
        // provjeriti metodu
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // Tell the API we're sending JSON
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      // 4. Get the response from the API (e.g., the new comment object)
      const deletedComment = await response.json();
      console.log("Comment delete successfully:", deletedComment);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="delete-comment-form">
      <button type="submit">Delete</button>
      {/* onClick={handleCancelSubmit} */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
}

export default DeleteComment;
