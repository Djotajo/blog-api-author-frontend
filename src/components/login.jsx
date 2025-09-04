import { useState } from "react";
import FormatPostDate from "./formatPostDate";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(""); // State to hold login error messages
  const [loggedInUser, setLoggedInUser] = useState(null); // New state to temporarily hold decoded user info for display
  const [tokenReceived, setTokenReceived] = useState(null); // New state to hold the raw token

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoginError(""); // Clear any previous errors on new submission
    // setLoggedInUser(null);
    // setTokenReceived(null);

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

      console.log("Login successful:", responseData);

      const token = responseData.token;

      if (token) {
        login(token);
        console.log("Login sauccessful, global state updated.");
        navigate("/");
      }
      // localStorage.setItem("jwt_token", token);
      // setTokenReceived(token);
      // console.log("JWT Token stored in localStorage.");

      // 3. Decode the token to get user information (username and id)
      // This decoding is *only* for client-side display/initial check.
      // The authoritative source for user identity is always the backend verifying the token.
      // try {
      //   const decodedToken = jwtDecode(token);
      //   const { username: loggedInUsername, id: loggedInUserId } =
      //     decodedToken;
      //   setLoggedInUser({ username: loggedInUsername, id: loggedInUserId });
      //   console.log(
      //     `Decoded user: ${loggedInUsername} (ID: ${loggedInUserId})`
      //   );

      // --- Placeholder for Step 2: Global State Update (AuthContext) ---
      // In the next step, after creating AuthContext, you would replace or add:
      // login(loggedInUsername, loggedInUserId);
      // (assuming 'login' is a function from useAuth() in AuthContext)
      // --- END Placeholder ---

      // 4. Navigate to a different page after successful login
      // (You can uncomment this and direct it to your dashboard or home page)
      // navigate('/dashboard');
      //   } catch (decodeError) {
      //     console.error(
      //       "Error decoding JWT token on client-side:",
      //       decodeError
      //     );
      //     // If the token itself is invalid or corrupted, clear it and inform the user
      //     localStorage.removeItem("jwt_token");
      //     setLoginError(
      //       "Login successful, but there was an issue decoding the token. Please try again."
      //     );
      //     setLoggedInUser(null);
      //     setTokenReceived(null);
      //   }
      // }
      else {
        setLoginError(
          "Login successful, but no token was received from the server. Please contact support."
        );
      }
    } catch (error) {
      console.error("Error during login request:", error);
      setLoginError(error.message); // Display the error message from the thrown error
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
      {/* ubaciti link za user site */}
      <a href="/userSite">
        Not an author? Check out the regular user site here
      </a>

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
