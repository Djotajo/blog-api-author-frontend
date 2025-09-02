import GetPosts from "./getPosts";
import CreatePost from "./createPost";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { currentUser, loadingInitial } = useAuth();

  return (
    <>
      <p>Home</p>
      {currentUser && (
        <>
          <GetPosts authorId={currentUser.id} />
        </>
      )}
    </>
  );
}

export default Home;
