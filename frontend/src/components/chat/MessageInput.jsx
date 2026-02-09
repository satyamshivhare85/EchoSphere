import React, { useState, useContext } from "react";
import axios from "axios";
import { ImagePlus, Send, X } from "lucide-react";
import { authDataContext } from "../../context/AuthContext";

const MessageInput = ({ chat, onSend }) => {
  const { serverUrl } = useContext(authDataContext);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  const send = async () => {
    if (!text && files.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("conversationId", chat._id);
      formData.append("content", text);
      formData.append("messageType", files.length ? "image" : "text");

      files.forEach((f) => formData.append("media", f));

      await axios.post(`${serverUrl}/api/chat/message`, formData, {
        withCredentials: true,
      });

      setText("");
      setFiles([]);
      onSend();
    } catch (err) {
      console.log(err);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-white/5 bg-black/40 backdrop-blur-xl">
      
      {/* IMAGE PREVIEW */}
      {files.length > 0 && (
        <div className="flex gap-3 px-4 pt-3 overflow-x-auto">
          {files.map((file, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-20 h-20 object-cover rounded-lg border border-white/10"
              />
              <button
                onClick={() => removeFile(i)}
                className="absolute -top-2 -right-2 bg-[#8b1a1a] p-1 rounded-full"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* INPUT ROW */}
      <div className="p-3 flex items-center gap-3">
        
        {/* FILE PICKER */}
        <label className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition">
          <ImagePlus size={20} />
          <input
            type="file"
            multiple
            hidden
            accept="image/*"
            onChange={(e) => setFiles([...files, ...e.target.files])}
          />
        </label>

        {/* TEXT */}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#8b1a1a]"
        />

        {/* SEND */}
        <button
          onClick={send}
          className="bg-[#8b1a1a] hover:bg-[#a11f1f] text-white px-4 py-2 rounded-full flex items-center justify-center transition shadow-lg shadow-[#8b1a1a]/30"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
