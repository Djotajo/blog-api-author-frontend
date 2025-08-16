import { useState } from "react";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.css";

import GetPosts from "./components/getPosts";

import { AuthProvider, useAuth } from "./context/AuthContext";
import GetPost from "./components/getPost";
import LogIn from "./components/login";
import AdminLogin from "./components/adminLogin";
import SignUp from "./components/signup";
import CreatePost from "./components/createPost";

function AuthStatus() {
  const { currentUser, logout, loadingInitial } = useAuth();

  // If still checking for a token, return null or a simple loading indicator
  if (loadingInitial) {
    return null; // Or <span>Loading session...</span>;
  }

  // Only render if the user is authenticated
  if (currentUser && currentUser.isAuthenticated) {
    return (
      // You can put this anywhere in your nav, e.g., in a separate li or directly.
      // I'll keep it as a li for consistency with nav-links.
      <li className="nav-item">
        <p style={{ margin: 0, color: "white", display: "inline-block" }}>
          Welcome, <strong>{currentUser.username}</strong>!{" "}
        </p>
        <button
          onClick={logout}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            cursor: "pointer",
            background: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Logout
        </button>
      </li>
    );
  } else {
    return <Link to="/login">Log In</Link>;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <nav>
          <h1>Random Blog Websites</h1>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/newPost">New Post</Link>
            </li>
            <li>
              <Link to="/categories">About</Link>
            </li>
            <li>
              <Link to="/adminlogin">Admin login</Link>
            </li>
            <AuthStatus />
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<GetPosts />} />
          <Route path="/items" element={<GetPosts />} />
          <Route path="/newPost" element={<CreatePost />} />
          <Route path="/adminlogin" element={<AdminLogin />} />

          <Route path="/:postId" element={<GetPost />} />
          {/* You can add more routes as needed */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>

        <footer>
          <p>Made by Djotajo</p>
        </footer>
      </Router>
    </AuthProvider>
  );
}

export default App;
