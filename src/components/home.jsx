import GetPosts from "./getPosts";
import GetDrafts from "./getDrafts";
import CreatePost from "./createPost";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { currentUser, loadingInitial } = useAuth();
  console.log(currentUser);

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
