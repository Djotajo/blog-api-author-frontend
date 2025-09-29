import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useApiUrl } from "../context/ApiUrlContext";

function DeletePost() {
  const { postId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");
  const apiUrl = useApiUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiEndpoint = `${apiUrl}/dashboard/posts/${postId}`;

      const response = await fetch(apiEndpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete post");
      }

      navigate(`/dashboard/posts`);
    } catch (error) {
      console.error("Error deleting post:", error);
      setErrorMessage(error.message);
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
