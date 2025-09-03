import GetPosts from "./getPosts";
import CreatePost from "./createPost";
import { useAuth } from "../context/AuthContext";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home() {
  const { currentUser, loadingInitial } = useAuth();

  return (
    <>
      <p>Home</p>
      {currentUser &&
        currentUser.isAuthenticated &&
        currentUser.role === "author" && (
          <>
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
            </div>
          </>
        )}
    </>
  );
}

export default Home;
