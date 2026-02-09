// import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
// import axios from "axios";
// import { ArrowLeft, Send, ImagePlus, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { authDataContext } from "../../context/AuthContext";
// import { UserDataContext } from "../../context/userContext";

// const ChatBox = ({ activeChat, setActiveChat }) => {
//   const { serverUrl } = useContext(authDataContext);
//   const { userData } = useContext(UserDataContext);
//   const navigate = useNavigate();

//   const [messages, setMessages] = useState([]);
//   const [pendingMessages, setPendingMessages] = useState([]);
//   const [text, setText] = useState("");
//   const [files, setFiles] = useState([]);
//   const [showGroupModal, setShowGroupModal] = useState(false);
//   const bottomRef = useRef();

//   // ✅ Load messages
//   const load = async () => {
//     if (!activeChat?._id) return;
//     try {
//       const res = await axios.get(
//         `${serverUrl}/api/chat/message/${activeChat._id}`,
//         { withCredentials: true }
//       );
//       setMessages(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, [activeChat]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, pendingMessages]);

//   // ✅ Chat header data
//   const otherUser = useMemo(() => {
//     if (!activeChat || activeChat.isGroup) return null;
//     return activeChat.participants?.find(
//       (p) => String(p._id) !== String(userData?._id)
//     );
//   }, [activeChat, userData]);

//   const chatName = useMemo(() => {
//     if (!activeChat) return "";
//     if (activeChat.isGroup) return activeChat.name || "Group";
//     return otherUser
//       ? `${otherUser.firstname} ${otherUser.lastname}`
//       : "User";
//   }, [activeChat, otherUser]);

//   // ✅ Send message (text + image) with optimistic rendering
//   const sendMessage = async () => {
//     if (!text.trim() && files.length === 0) return;

//     // Create pending messages for immediate UI
//     const newPending = files.map((f) => ({
//       _id: `temp-${Date.now()}-${f.name}`,
//       content: URL.createObjectURL(f),
//       messageType: "image",
//       sender: userData,
//       uploading: true,
//     }));

//     if (text.trim()) {
//       newPending.push({
//         _id: `temp-${Date.now()}-text`,
//         content: text,
//         messageType: "text",
//         sender: userData,
//         uploading: false,
//       });
//     }

//     setPendingMessages((prev) => [...prev, ...newPending]);
//     setText("");
//     setFiles([]);

//     try {
//       const formData = new FormData();
//       formData.append("conversationId", activeChat._id);
//       formData.append("content", text);
//       formData.append("messageType", files.length ? "image" : "text");
//       files.forEach((f) => formData.append("media", f));

//       await axios.post(`${serverUrl}/api/chat/message`, formData, {
//         withCredentials: true,
//       });

//       // Remove pending messages after success
//       setPendingMessages((prev) =>
//         prev.filter((msg) => !msg._id.startsWith("temp"))
//       );

//       load(); // refresh messages from server
//     } catch (err) {
//       console.log(err);
//       // Mark failed uploads
//       setPendingMessages((prev) =>
//         prev.map((msg) =>
//           msg._id.startsWith("temp") ? { ...msg, uploading: false, error: true } : msg
//         )
//       );
//     }
//   };

//   const handleKey = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const removeFile = (i) => {
//     setFiles((prev) => prev.filter((_, index) => index !== i));
//   };

//   if (!activeChat) {
//     return (
//       <div className="flex-1 hidden md:flex items-center justify-center text-white/40">
//         Select a chat to start messaging
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col bg-[#080808] mt-6">
//       {/* HEADER */}
//       <div className="p-4 border-b border-white/5 backdrop-blur-xl bg-black/40 flex items-center gap-3">
//         <button
//           onClick={() => setActiveChat(null)}
//           className="md:hidden p-2 rounded-full hover:bg-white/10 transition"
//         >
//           <ArrowLeft />
//         </button>

//         {/* CLICKABLE USER INFO / GROUP */}
//         <div
//           onClick={() => {
//             if (activeChat.isGroup) setShowGroupModal(true);
//             else if (otherUser) navigate(`/profile/${otherUser._id}`);
//           }}
//           className="flex items-center gap-3 cursor-pointer group"
//         >
//           {activeChat.isGroup ? (
//             <div className="w-10 h-10 rounded-full bg-[#8b1a1a] flex items-center justify-center text-sm font-semibold">
//               {chatName?.charAt(0)}
//             </div>
//           ) : otherUser?.profileImage ? (
//             <img
//               src={otherUser.profileImage}
//               alt="profile"
//               className="w-10 h-10 rounded-full object-cover border border-white/10"
//             />
//           ) : (
//             <div className="w-10 h-10 rounded-full bg-[#8b1a1a] flex items-center justify-center text-sm font-semibold">
//               {chatName?.charAt(0)}
//             </div>
//           )}

//           <div className="leading-tight">
//             <p className="font-semibold tracking-wide group-hover:text-[#8b1a1a] transition">
//               {chatName}
//             </p>
//             {!activeChat.isGroup && (
//               <p className="text-xs text-white/40">View profile</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-4">
//         {[...messages, ...pendingMessages].map((m) => {
//           const mine = String(m.sender?._id) === String(userData?._id);
//           return (
//             <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
//               <div
//                 className={`px-4 py-2 rounded-2xl max-w-xs text-sm relative ${
//                   mine
//                     ? "bg-[#8b1a1a] text-white"
//                     : "bg-white/10 text-white border border-white/10"
//                 }`}
//               >
//                 {m.messageType === "text" && <p>{m.content}</p>}

//                 {m.messageType === "image" && (
//                   <div className="relative">
//                     <img
//                       src={m.content}
//                       alt="media"
//                       className="mt-2 rounded-lg max-h-60 object-cover"
//                     />
//                     {m.uploading && (
//                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
//                         <p className="text-white text-xs">Uploading...</p>
//                       </div>
//                     )}
//                     {m.error && (
//                       <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center rounded-lg">
//                         <p className="text-white text-xs">Failed</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       {/* IMAGE PREVIEW */}
//       {files.length > 0 && (
//         <div className="flex gap-3 px-4 pb-2 overflow-x-auto">
//           {files.map((file, i) => (
//             <div key={i} className="relative">
//               <img
//                 src={URL.createObjectURL(file)}
//                 alt="preview"
//                 className="w-20 h-20 object-cover rounded-lg border border-white/10"
//               />
//               <button
//                 onClick={() => removeFile(i)}
//                 className="absolute -top-2 -right-2 bg-[#8b1a1a] p-1 rounded-full"
//               >
//                 <X size={12} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* INPUT */}
//       <div className="p-4 border-t border-white/5 backdrop-blur-xl bg-black/40 flex gap-3 items-center">
//         {/* FILE */}
//         <label className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition">
//           <ImagePlus size={20} />
//           <input
//             type="file"
//             hidden
//             multiple
//             accept="image/*"
//             onChange={(e) => setFiles([...files, ...e.target.files])}
//           />
//         </label>

//         {/* TEXT */}
//         <input
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={handleKey}
//           placeholder="Type a message..."
//           className="flex-1 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#8b1a1a]"
//         />

//         {/* SEND */}
//         <button
//           onClick={sendMessage}
//           className="bg-[#8b1a1a] hover:bg-[#a11f1f] text-white px-5 rounded-full flex items-center justify-center transition-all shadow-lg shadow-[#8b1a1a]/30"
//         >
//           <Send size={18} />
//         </button>
//       </div>

//       {/* GROUP MODAL */}
//       {showGroupModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-[#080808] p-6 rounded-lg w-96 text-white max-h-[80vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">{activeChat.name || "Group"}</h2>
//               <button
//                 onClick={() => setShowGroupModal(false)}
//                 className="p-1 rounded-full hover:bg-white/10"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//             <div className="space-y-3">
//               {activeChat.participants.map((member) => (
//                 <div
//                   key={member._id}
//                   className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded"
//                   onClick={() => navigate(`/profile/${member._id}`)}
//                 >
//                   {member.profileImage ? (
//                     <img
//                       src={member.profileImage}
//                       alt="profile"
//                       className="w-8 h-8 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-8 h-8 rounded-full bg-[#8b1a1a] flex items-center justify-center text-xs font-semibold">
//                       {member.firstname?.charAt(0)}
//                     </div>
//                   )}
//                   <div>
//                     <p className="text-sm font-medium">
//                       {member.firstname} {member.lastname}
//                     </p>
//                     <p className="text-xs text-white/40">@{member.username}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBox;


import React, { useEffect, useState, useContext, useRef, useMemo } from "react";
import axios from "axios";
import { ArrowLeft, Send, ImagePlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authDataContext } from "../../context/AuthContext";
import { UserDataContext } from "../../context/userContext";

const ChatBox = ({ activeChat, setActiveChat }) => {
  const { serverUrl } = useContext(authDataContext);
  const { userData, socket, listenSocketEvent } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [pendingMessages, setPendingMessages] = useState([]);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const bottomRef = useRef();

  // ✅ Load messages
  const load = async () => {
    if (!activeChat?._id) return;
    try {
      const res = await axios.get(
        `${serverUrl}/api/chat/message/${activeChat._id}`,
        { withCredentials: true }
      );
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    load();
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingMessages]);

  // ✅ Listen for real-time messages
  useEffect(() => {
    if (!activeChat?._id) return;

    const unsubscribe = listenSocketEvent("receiveMessage", (msg) => {
      if (msg.conversation === activeChat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [activeChat?._id, listenSocketEvent]);

  // ✅ Chat header data
  const otherUser = useMemo(() => {
    if (!activeChat || activeChat.isGroup) return null;
    return activeChat.participants?.find(
      (p) => String(p._id) !== String(userData?._id)
    );
  }, [activeChat, userData]);

  const chatName = useMemo(() => {
    if (!activeChat) return "";
    if (activeChat.isGroup) return activeChat.name || "Group";
    return otherUser
      ? `${otherUser.firstname} ${otherUser.lastname}`
      : "User";
  }, [activeChat, otherUser]);

  // ✅ Send message (text + image) with optimistic rendering
  const sendMessage = async () => {
    if (!text.trim() && files.length === 0) return;

    // Pending messages for UI
    const newPending = files.map((f) => ({
      _id: `temp-${Date.now()}-${f.name}`,
      content: URL.createObjectURL(f),
      messageType: "image",
      sender: userData,
      uploading: true,
    }));

    if (text.trim()) {
      newPending.push({
        _id: `temp-${Date.now()}-text`,
        content: text,
        messageType: "text",
        sender: userData,
        uploading: false,
      });
    }

    setPendingMessages((prev) => [...prev, ...newPending]);

    // ✅ Emit real-time message
    socket?.emit("sendMessage", {
      conversationId: activeChat._id,
      content: text,
      messageType: files.length ? "image" : "text",
    });

    setText("");
    setFiles([]);

    // Save to server
    try {
      const formData = new FormData();
      formData.append("conversationId", activeChat._id);
      formData.append("content", text);
      formData.append("messageType", files.length ? "image" : "text");
      files.forEach((f) => formData.append("media", f));

      await axios.post(`${serverUrl}/api/chat/message`, formData, {
        withCredentials: true,
      });

      // Remove pending messages after success
      setPendingMessages((prev) =>
        prev.filter((msg) => !msg._id.startsWith("temp"))
      );

      load(); // refresh messages from server
    } catch (err) {
      console.log(err);
      // Mark failed uploads
      setPendingMessages((prev) =>
        prev.map((msg) =>
          msg._id.startsWith("temp")
            ? { ...msg, uploading: false, error: true }
            : msg
        )
      );
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const removeFile = (i) => {
    setFiles((prev) => prev.filter((_, index) => index !== i));
  };

  if (!activeChat) {
    return (
      <div className="flex-1 hidden md:flex items-center justify-center text-white/40">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#080808] mt-6">
      {/* HEADER */}
      <div className="p-4 border-b border-white/5 backdrop-blur-xl bg-black/40 flex items-center gap-3">
        <button
          onClick={() => setActiveChat(null)}
          className="md:hidden p-2 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft />
        </button>

        {/* CLICKABLE USER INFO / GROUP */}
        <div
          onClick={() => {
            if (activeChat.isGroup) setShowGroupModal(true);
            else if (otherUser) navigate(`/profile/${otherUser._id}`);
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {activeChat.isGroup ? (
            <div className="w-10 h-10 rounded-full bg-[#8b1a1a] flex items-center justify-center text-sm font-semibold">
              {chatName?.charAt(0)}
            </div>
          ) : otherUser?.profileImage ? (
            <img
              src={otherUser.profileImage}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#8b1a1a] flex items-center justify-center text-sm font-semibold">
              {chatName?.charAt(0)}
            </div>
          )}

          <div className="leading-tight">
            <p className="font-semibold tracking-wide group-hover:text-[#8b1a1a] transition">
              {chatName}
            </p>
            {!activeChat.isGroup && (
              <p className="text-xs text-white/40">View profile</p>
            )}
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {[...messages, ...pendingMessages].map((m) => {
          const mine = String(m.sender?._id) === String(userData?._id);
          return (
            <div
              key={m._id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs text-sm relative ${
                  mine
                    ? "bg-[#8b1a1a] text-white"
                    : "bg-white/10 text-white border border-white/10"
                }`}
              >
                {m.messageType === "text" && <p>{m.content}</p>}

                {m.messageType === "image" && (
                  <div className="relative">
                    <img
                      src={m.content}
                      alt="media"
                      className="mt-2 rounded-lg max-h-60 object-cover"
                    />
                    {m.uploading && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg">
                        <p className="text-white text-xs">Uploading...</p>
                      </div>
                    )}
                    {m.error && (
                      <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center rounded-lg">
                        <p className="text-white text-xs">Failed</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* IMAGE PREVIEW */}
      {files.length > 0 && (
        <div className="flex gap-3 px-4 pb-2 overflow-x-auto">
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

      {/* INPUT */}
      <div className="p-4 border-t border-white/5 backdrop-blur-xl bg-black/40 flex gap-3 items-center">
        <label className="cursor-pointer p-2 hover:bg-white/10 rounded-full transition">
          <ImagePlus size={20} />
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={(e) => setFiles([...files, ...e.target.files])}
          />
        </label>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#8b1a1a]"
        />

        <button
          onClick={sendMessage}
          className="bg-[#8b1a1a] hover:bg-[#a11f1f] text-white px-5 rounded-full flex items-center justify-center transition-all shadow-lg shadow-[#8b1a1a]/30"
        >
          <Send size={18} />
        </button>
      </div>

      {/* GROUP MODAL */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#080808] p-6 rounded-lg w-96 text-white max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {activeChat.name || "Group"}
              </h2>
              <button
                onClick={() => setShowGroupModal(false)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {activeChat.participants.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded"
                  onClick={() => navigate(`/profile/${member._id}`)}
                >
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt="profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#8b1a1a] flex items-center justify-center text-xs font-semibold">
                      {member.firstname?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">
                      {member.firstname} {member.lastname}
                    </p>
                    <p className="text-xs text-white/40">@{member.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
