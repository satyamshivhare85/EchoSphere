
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import PostCard from"../components/post/PostCard"
import CreatePost from "../components/post/CreatePost";
import SuggestedUsers from "../components/SuggestedUsers";
import { authDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/userContext";

const DEFAULT_DP = "/assets/Dp.avif";

const PostPage = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [openCreate, setOpenCreate] = useState(false);

  const { serverUrl } = useContext(authDataContext);
  const { userData, socket, listenSocketEvent } = useContext(UserDataContext);

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/post/getpost`, { withCredentials: true });
      const formatted = res.data.map((post) => ({
        ...post,
        author: { ...post.author, profileImage: post.author?.profileImage || DEFAULT_DP },
        like: post.like || [],
        comment: post.comment?.map((c) => ({
          ...c,
          user: { ...c.user, profileImage: c.user?.profileImage || DEFAULT_DP },
        })) || [],
      }));

      setPosts(formatted);

      const liked = {};
      formatted.forEach((post) => {
        liked[post._id] = post.like.some((u) => u._id === userData?._id);
      });
      setLikedPosts(liked);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (serverUrl && userData) fetchPosts();
  }, [serverUrl, userData]);

  // ================= SOCKET.IO LISTENERS =================
  useEffect(() => {
    // New post
    const unsubNewPost = listenSocketEvent("newPost", (post) => {
      setPosts((prev) => [post, ...prev]);
    });

  

    const unsubLike = listenSocketEvent("postLiked", async ({ postId, userId }) => {
  try {
    // Fetch user info for the like
    const res = await axios.get(`${serverUrl}/api/user/${userId}`, { withCredentials: true });
    const user = res.data; // { _id, firstname, lastname, profileImage }

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              like: p.like.some((u) => u._id === user._id)
                ? p.like.filter((u) => u._id !== user._id) // unlike
                : [...p.like, user], // proper user info
            }
          : p
      )
    );

    setLikedPosts((prev) => ({ ...prev, [postId]: true }));
  } catch (err) {
    console.error("Error fetching user for like:", err);
  }
});

    // New comment
    const unsubComment = listenSocketEvent("postCommented", ({ postId, comment }) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, comment: [...p.comment, comment] } : p))
      );
    });

    return () => {
      unsubNewPost?.();
      unsubLike?.();
      unsubComment?.();
    };
  }, [listenSocketEvent]);

  // ================= LIKE POST =================
  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`${serverUrl}/api/post/like/${postId}`, {}, { withCredentials: true });
      socket.emit("likePost", { postId, userId: userData._id });
      setLikedPosts((p) => ({ ...p, [postId]: res.data.liked }));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADD COMMENT =================
  const handleAddComment = async (postId, text) => {
    if (!text?.trim()) return;
    try {
      const res = await axios.post(`${serverUrl}/api/post/comment/${postId}`, { text }, { withCredentials: true });
      socket.emit("commentPost", { postId, comment: { ...res.data.comment, user: userData } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Nav />
      <button onClick={() => setOpenCreate(true)} className="fixed bottom-8 right-8 z-40 bg-[#8b1a1a] p-4 rounded-full">+</button>

      <section className="pt-32 pb-24 max-w-[900px] mx-auto px-5 space-y-10">
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            userData={userData}
            likedPosts={likedPosts}
            handleLike={handleLike}
            handleAddComment={handleAddComment}
          />
        ))}
      </section>

      {openCreate && <CreatePost setUploadPost={setOpenCreate} />}
      <div className="max-w-[900px] mx-auto px-5 pb-16">
        <SuggestedUsers />
      </div>
    </div>
  );
};

export default PostPage;

