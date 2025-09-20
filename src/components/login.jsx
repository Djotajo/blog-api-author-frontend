import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [tokenReceived, setTokenReceived] = useState(null);

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginError("");

    const userData = {
      username: username,
      password: password,
    };

    try {
      const apiEndpoint = `http://localhost:3000/login`;

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to log in.");
      }

      const responseData = await response.json();

      const token = responseData.token;

      if (token) {
        login(token);
        navigate("/");
      } else {
        setLoginError(
          "Login successful, but no token was received from the server. Please contact support."
        );
      }
    } catch (error) {
      console.error("Error during login request:", error);
      setLoginError(error.message);
      setLoggedInUser(null);
      setTokenReceived(null);
    }
  };

  return (
    <div className="login-fullscreen">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Log In</h2>
        {loginError && <p style={{ color: "red" }}>{loginError}</p>}

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          placeholder="username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          placeholder="password"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button type="submit">Log In</button>
      </form>
      <a href="/signup">No Account? Sign Up</a>

      {tokenReceived && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid green",
          }}
        >
          <p>Login Successful! Token received and stored in localStorage.</p>
          {loggedInUser && (
            <p>
              Decoded User: <strong>{loggedInUser.username}</strong> (ID:{" "}
              {loggedInUser.id})
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;
