import { useState } from "react";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
      confirmPassword,
    };

    try {
      const apiEndpoint = `http://localhost:3000/signup`;

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to get user");
      }

      // 4. Get the response from the API (e.g., the new comment object)
      const newComment = await response.json();
      console.log("Comment added successfully:", newComment);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="login-fullscreen">
      <form onSubmit={handleSubmit} className="new-member-form">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="password">Password </label>
        <span>
          (at least 8 characters including 1 lowercase letter, 1 uppercase
          letter, 1 number, and 1 symbol)
        </span>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm password"
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
      <a href="./login">Already have an account? Sign in here</a>
    </div>
  );
}

export default SignUp;
