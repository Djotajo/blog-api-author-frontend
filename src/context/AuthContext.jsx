import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const navigate = useNavigate();

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
            exp: decoded.exp,
          });
        } else {
          console.log("JWT Token expired.");
          localStorage.removeItem("jwt_token");
          setCurrentUser(null);
          navigate("/login");
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
  }, [navigate]);

  useEffect(() => {
    if (!currentUser || !currentUser.exp) return;

    const currentTime = Date.now() / 1000;
    const msUntilExpiry = (currentUser.exp - currentTime) * 1000;

    if (msUntilExpiry <= 0) {
      logout();
      navigate("/login");
      return;
    }

    const timeoutId = setTimeout(() => {
      logout();
      navigate("/login");
    }, msUntilExpiry);

    return () => clearTimeout(timeoutId); // cleanup on unmount or currentUser change
  }, [currentUser, navigate]);

  const login = (token) => {
    localStorage.setItem("jwt_token", token);

    const decoded = jwtDecode(token);

    if (decoded.role !== "author") {
      alert(
        "Access denied: You are not an author, switch to regular user website."
      );
      return;
    }

    setCurrentUser({
      username: decoded.username,
      id: decoded.id,
      isAuthenticated: true,
      role: decoded.role,
      exp: decoded.exp,
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
