import { useAuth } from "../context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./login";
import GetStats from "./getStats";
import GetLastPost from "./getLastPost";

function Home() {
  const { currentUser, loadingInitial } = useAuth();

  return (
    <>
      {!currentUser && <Login />}
      {currentUser &&
        currentUser.isAuthenticated &&
        currentUser.role === "author" && (
          <div className="dashboard">
            <Link to="/dashboard/posts" className="dashboard-item">
              <div className="dashboard-item-header">Posts</div>

              <img src="/posts.jpg" alt="View all posts" />
            </Link>

            <Link to={`/dashboard/drafts`} className="dashboard-item">
              <div className="dashboard-item-header">Drafts</div>

              <img src="/coffee.jpg" alt="View all drafts" />
            </Link>

            <Link to="/dashboard/newPost" className="dashboard-item">
              <div className="dashboard-item-header">Create New Post</div>

              <img src="/drafts.jpg" alt="View all posts" />
            </Link>
            <GetLastPost />
            <GetStats />
          </div>
        )}
    </>
  );
}

export default Home;
