import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApiUrl } from "../context/ApiUrlContext";

function EditComment({ commentObject }, key) {
  const [comment, setComment] = useState(commentObject.text);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const { currentUser, loadingInitial } = useAuth();
  const { postId } = useParams();

  const token = localStorage.getItem("jwt_token");

  const commentId = commentObject.id;
  const apiUrl = useApiUrl();

  if (loadingInitial) {
    return <p>Loading user information...</p>;
  }

  if (!currentUser || !currentUser.isAuthenticated) {
    return <p>You are not logged in.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const commentData = {
      id: commentId,
      text: comment,
      userId: currentUser.id,
      parentId: postId,
    };

    try {
      const apiEndpoint = `${apiUrl}/posts/${postId}/${commentId}`;

      const response = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to edit comment");
      }

      setIsEditing(false);
      setComment("");
      navigate(0);
    } catch (error) {
      console.error("Error editing comment:", error);
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      {isEditing && (
        <form onSubmit={handleSubmit} className="comment-form">
          <fieldset>
            <div>
              <label htmlFor="comment">Comment: </label>
              <textarea
                id="comment"
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
                autoFocus
                aria-required="true"
              ></textarea>
            </div>
            <button type="submit">Submit</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          </fieldset>
        </form>
      )}
    </>
  );
}

export default EditComment;
