import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check for token expiration
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decoded.exp > currentTime) {
          // Token is valid and not expired
          setCurrentUser({
            username: decoded.username,
            id: decoded.id,
            isAuthenticated: true,
          });
        } else {
          // Token expired, remove it from localStorage
          console.log("JWT Token expired.");
          localStorage.removeItem("jwt_token");
          setCurrentUser(null);
        }
      } catch (error) {
        // Token is invalid (e.g., malformed, signature mismatch)
        console.error(
          "Error decoding or verifying JWT token from localStorage:",
          error
        );
        localStorage.removeItem("jwt_token"); // Remove invalid token
        setCurrentUser(null);
      }
    }
    setLoadingInitial(false); // Finished initial check
  }, []);

  // const login = (username, id) => {
  //   setCurrentUser({ username, id, isAuthenticated: true });
  // };

  const login = (token) => {
    // Now accepts the token
    // Save the token to localStorage
    localStorage.setItem("jwt_token", token);

    // Decode the token to get the user info
    const decoded = jwtDecode(token);

    // Set the user state with data from the decoded token
    setCurrentUser({
      username: decoded.username,
      id: decoded.id,
      isAuthenticated: true,
    });
  };
  const logout = () => {
    localStorage.removeItem("jwt_token"); // Remove token from localStorage
    setCurrentUser(null); // Clear user from state
    console.log("Logged out. Token removed from localStorage.");
  };

  const contextValue = {
    currentUser,
    login,
    logout,
    loadingInitial, // Provide loading status to prevent flickering
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
