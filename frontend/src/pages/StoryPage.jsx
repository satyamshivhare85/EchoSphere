import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/userContext";
import Nav from "../components/Nav";

// Sliding Text Component for the Hero section
const HeroSlider = () => {
  const messages = [
    "Share your story anonymously.",
    "Connecting People, Connecting Voices.",
    "Because We Care About You.",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-40 flex items-center justify-center text-center">
    <Nav/>

      <h2 className="text-3xl md:text-5xl font-serif italic transition-opacity duration-1000 ease-in-out">
        {messages[index]}
      </h2>
    </div>
  );
};

const StoryPage = () => {
  const { serverUrl } = useContext(authDataContext);
  const { socket, listenSocketEvent } = useContext(UserDataContext);

  const [stories, setStories] = useState([]);
  const [newStory, setNewStory] = useState("");
  const [replyContent, setReplyContent] = useState({});

  // ================= LOGIC (UNCHANGED) =================
  const loadStories = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/story`);
      setStories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    const unsubStory = listenSocketEvent("newStory", (story) => {
      setStories((prev) => [story, ...prev]);
    });

    const unsubReply = listenSocketEvent("newReply", ({ storyId, reply }) => {
      setStories((prev) =>
        prev.map((s) =>
          s._id === storyId ? { ...s, replies: [...s.replies, reply] } : s
        )
      );
    });

    return () => {
      unsubStory?.();
      unsubReply?.();
    };
  }, [listenSocketEvent]);

  const postStory = async () => {
    if (!newStory.trim()) return;
    try {
      await axios.post(`${serverUrl}/api/story`, { content: newStory });
      setNewStory("");
    } catch (err) {
      console.log(err);
    }
  };

  const postReply = async (storyId) => {
    if (!replyContent[storyId]?.trim()) return;
    try {
      await axios.post(`${serverUrl}/api/story/${storyId}/reply`, {
        content: replyContent[storyId],
      });
      setReplyContent((prev) => ({ ...prev, [storyId]: "" }));
    } catch (err) {
      console.log(err);
    }
  };

  // ================= UI RENDERING =================
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#8b1a1a]">
      {/* Background Gradient Spot */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#8b1a1a]/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header Section */}
        <header className="mb-12 border-b border-white/10 pb-8">
            <HeroSlider />
        </header>

        {/* Post Story Input Card */}
        <section className="mb-16">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm shadow-xl">
            <textarea
              value={newStory}
              onChange={(e) => setNewStory(e.target.value)}
              placeholder="What's on your mind? Don't worry, it's anonymous..."
              className="w-full h-32 p-4 rounded-xl bg-black/40 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#8b1a1a] transition-all resize-none"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={postStory}
                className="px-8 py-3 bg-[#8b1a1a] text-sm font-bold uppercase tracking-widest rounded-full hover:bg-[#a11f1f] transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#8b1a1a]/20"
              >
                Post Story
              </button>
            </div>
          </div>
        </section>

        {/* Stories Feed */}
        <div className="space-y-10">
          <h3 className="text-white/40 uppercase tracking-[0.2em] text-xs font-bold mb-6">Recent Voices</h3>
          {stories.map((story) => (
            <div
              key={story._id}
              className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 p-8 rounded-3xl transition-all duration-500"
            >
              <div className="mb-6">
                <span className="text-[#8b1a1a] text-2xl mr-2">“</span>
                <p className="inline text-lg leading-relaxed text-white/90 font-light italic">
                  {story.content}
                </p>
              </div>

              {/* Replies Container */}
              <div className="space-y-4 mb-6">
                {story.replies.map((r, idx) => (
                  <div
                    key={idx}
                    className="ml-6 p-4 bg-white/5 rounded-2xl border-l-2 border-[#8b1a1a]/40 text-sm text-white/70"
                  >
                    {r.content}
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <input
                  value={replyContent[story._id] || ""}
                  onChange={(e) =>
                    setReplyContent((prev) => ({
                      ...prev,
                      [story._id]: e.target.value,
                    }))
                  }
                  placeholder="Comfort them with a reply..."
                  className="flex-1 px-4 py-2 text-sm rounded-full bg-black/50 border border-white/10 focus:outline-none focus:border-[#8b1a1a]/50 transition-all"
                />
                <button
                  onClick={() => postReply(story._id)}
                  className="p-2 px-5 bg-white/10 hover:bg-[#8b1a1a] rounded-full text-xs font-bold transition-colors"
                >
                  Reply
                </button>
              </div>
              
              <div className="absolute top-4 right-6 text-[10px] text-white/20 uppercase tracking-tighter">
                {story.replies.length} Responses
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryPage;