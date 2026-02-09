import React, { useContext, useRef, useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaRegImage } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dp from "../../assets/Dp.avif";

import { UserDataContext } from "../../context/userContext";
import { authDataContext } from "../../context/AuthContext";

function CreatePost({ setUploadPost }) {
  const { userData, setPostData } = useContext(UserDataContext);
  const { serverUrl } = useContext(authDataContext);

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [backendMedia, setBackendMedia] = useState([]);
  const [frontendMedia, setFrontendMedia] = useState([]);

  const mediaRef = useRef();
  const textareaRef = useRef();
  const navigate = useNavigate();

  // 🔹 Handle multiple media selection
  function handleMedia(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Append new files instead of replacing old ones
    setBackendMedia(prev => [...prev, ...files]);
    setFrontendMedia(prev => [
      ...prev,
      ...files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
    ]);
  }

  // 🔹 Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [description]);

  // 🔹 Upload post
  async function handleUploadPost() {
    if (loading) return;
    // if (!description && backendMedia.length === 0) return;
    if (!description.trim()) return;


    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("description", description);

      backendMedia.forEach(file => formData.append("media", file));

      const res = await axios.post(
        `${serverUrl}/api/post/create`,
        formData,
        { withCredentials: true }
      );

      // Add new post at top
      setPostData(prev => [res.data.post, ...prev]);

      // Reset state
      setDescription("");
      setBackendMedia([]);
      setFrontendMedia([]);

      // Close modal & navigate
      setUploadPost(false);
      navigate("/post");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[520px] bg-[#111] rounded-xl shadow-xl relative flex flex-col">

        {/* ❌ Close */}
        <button
          onClick={() => !loading && setUploadPost(false)}
          className="absolute top-3 right-3 cursor-pointer"
          disabled={loading}
        >
          <RxCross1 className="w-6 h-6 text-gray-300 hover:text-white transition-colors" />
        </button>

        {/* 🔹 Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-700">
           <img
            src={userData?.profileImage || Dp}
            className="w-[52px] h-[52px] rounded-full object-cover"
          /> 
     

          <div className="font-semibold text-white">
            {userData?.firstname} {userData?.lastname}
          </div>
        </div>

        {/* 🔹 Body */}
        <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
          <textarea
            ref={textareaRef}
             required
            className="w-full resize-none outline-none text-white bg-[#111] placeholder-gray-500 text-[18px] min-h-[80px] max-h-[400px] overflow-y-auto rounded-lg p-3"
            placeholder="What do you want to talk about?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            disabled={loading}
          />

          {/* 🔥 Media Preview with delete */}
          {frontendMedia.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {frontendMedia.map((item, i) => (
                <div key={i} className="relative group">
                  {item.file.type.startsWith("video") ? (
                    <video
                      src={item.preview}
                      controls
                      className="rounded-xl w-full h-auto"
                    />
                  ) : (
                    <img
                      src={item.preview}
                      className="rounded-xl w-full h-auto"
                    />
                  )}
                  {/* ❌ Delete single media */}
                  <button
                    onClick={() => {
                      setFrontendMedia(prev => prev.filter((_, idx) => idx !== i));
                      setBackendMedia(prev => prev.filter((_, idx) => idx !== i));
                    }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"
                  >
                    <RxCross1 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hidden file input */}
          <input
            type="file"
            hidden
            ref={mediaRef}
            accept="image/*,video/*"
            multiple
            onChange={handleMedia}
          />
        </div>

        {/* 🔹 Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-700">
          <FaRegImage
            className="w-[22px] h-[22px] text-gray-400 cursor-pointer hover:text-white transition-colors"
            onClick={() => !loading && mediaRef.current.click()}
          />

          <button
            onClick={handleUploadPost}
            // disabled={loading || (!description && backendMedia.length === 0)}
            disabled={loading || !description.trim()}

            className="px-6 py-2 bg-[#8b1a1a] text-white rounded-full font-semibold
            hover:bg-[#a11f1f] transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default CreatePost;



