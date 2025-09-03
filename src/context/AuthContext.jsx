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
        const currentTime = Date.now() / 1000; // Convert to seconds
        if (decoded.exp > currentTime) {
          setCurrentUser({
            username: decoded.username,
            id: decoded.id,
            isAuthenticated: true,
            role: decoded.role,
          });
        } else {
          console.log("JWT Token expired.");
          localStorage.removeItem("jwt_token");
          setCurrentUser(null);
        }
      } catch (error) {
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

  const login = (token) => {
    localStorage.setItem("jwt_token", token);

    const decoded = jwtDecode(token);

    if (decoded.role !== "author") {
      alert("Access denied: You are not an author.");
      return;
    }

    setCurrentUser({
      username: decoded.username,
      id: decoded.id,
      isAuthenticated: true,
      role: decoded.role,
    });
  };
  const logout = () => {
    localStorage.removeItem("jwt_token");
    setCurrentUser(null);
    console.log("Logged out. Token removed from localStorage.");
  };

  const contextValue = {
    currentUser,
    login,
    logout,
    loadingInitial,
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
