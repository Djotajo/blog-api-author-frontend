import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./App.css";

import GetPosts from "./components/getPosts";

import { AuthProvider, useAuth } from "./context/AuthContext";
import GetPost from "./components/getPost";
import Login from "./components/login";
import SignUp from "./components/signup";
import CreatePost from "./components/createPost";
import GetDraft from "./components/getDraft";
import Home from "./components/home";
import GetDrafts from "./components/getDrafts";
import EditPost from "./components/editPost";
import AuthRedirect from "./components/authRedirect";

function AuthStatus() {
  const { currentUser, logout, loadingInitial } = useAuth();

  if (loadingInitial) {
    return null; // Or <span>Loading session...</span>;
  }

  if (currentUser && currentUser.isAuthenticated) {
    return (
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
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { currentUser, loadingInitial } = useAuth();
  console.log(currentUser);
  if (loadingInitial) return null;

  return (
    <>
      <nav>
        <h1>Random Blog Website</h1>
        <ul className="nav-links">
          {currentUser && currentUser.isAuthenticated && (
            <>
              <li>
                <Link to="/">Home</Link>
              </li>

              <li>
                <Link to="/newPost">New Post</Link>
              </li>
              <li>
                <Link to={`/dashboard/drafts/`}>Drafts</Link>
              </li>
              <AuthStatus />
            </>
          )}
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        {currentUser && currentUser.isAuthenticated && (
          <>
            <Route
              path="/dashboard/drafts"
              element={<GetPosts authorId={currentUser.id} showDrafts={true} />}
            />
            <Route
              path="/dashboard/posts"
              element={<GetPosts authorId={currentUser.id} showPosts={true} />}
            />
            <Route
              path="/dashboard/posts/:postId/edit"
              element={<EditPost />}
            />

            <Route path="/newPost" element={<CreatePost />} />
            <Route path="/dashboard/posts/:postId" element={<GetPost />} />

            <Route path="/dashboard/drafts/:postId" element={<GetDraft />} />
          </>
        )}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
      <footer>
        <p>Made by Djotajo</p>
      </footer>
    </>
  );
}

export default App;
