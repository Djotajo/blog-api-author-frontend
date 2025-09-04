import { useAuth } from "../context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./login";

function Home() {
  const { currentUser, loadingInitial } = useAuth();

  return (
    // <div className="home-div">
    <>
      {!currentUser && <Login />}
      {currentUser &&
        currentUser.isAuthenticated &&
        currentUser.role === "author" && (
          <div className="dashboard">
            <Link to="/posts" className="dashboard-item">
              <img src="/public/see-posts.png" alt="View all posts" />
            </Link>
            <Link
              to={`/posts/drafts/${currentUser.id}`}
              className="dashboard-item"
            >
              <img src="/public/see-drafts.png" alt="View all posts" />
            </Link>
            <Link to="/newPost" className="dashboard-item">
              <img src="/public/add-post.png" alt="View all posts" />
            </Link>
            <Link to="/posts" className="dashboard-item">
              <img src="/public/see-posts.png" alt="View all posts" />
            </Link>
            <Link to="/posts" className="dashboard-item">
              <img src="/public/see-posts.png" alt="View all posts" />
            </Link>
            <Link to="/posts" className="dashboard-item">
              <img src="/public/see-posts.png" alt="View all posts" />
            </Link>
          </div>
        )}
    </>
    // </div>
  );
}

export default Home;
