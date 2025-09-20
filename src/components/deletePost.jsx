import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function DeletePost() {
  const { postId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiEndpoint = `http://localhost:3000/dashboard/posts/${postId}`;

      const response = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      const deletedPost = await response.json();
      console.log("Post deleted successfully:", deletedPost);
      navigate(`/dashboard/posts`);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="delete-post-form">
      <button type="submit" className="delete-btn">
        Delete
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
}

export default DeletePost;
