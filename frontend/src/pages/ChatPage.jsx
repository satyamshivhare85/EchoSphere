// import React, { useState } from "react";
// import Conversations from "../components/chat/Conversation";
// import ChatBox from "../components/chat/ChatBox";
// import SearchChat from "../components/chat/SearchChat";
// import ChatSidebar from "../components/chat/ChatSidebar";
// import Nav from "../components/Nav";

// const ChatPage = () => {
//   const [activeChat, setActiveChat] = useState(null);

//   return (
//     <div className="h-screen overflow-hidden bg-black text-white">
//       {/* NAV */}
//       <Nav />

//       {/* BELOW NAV */}
//       <div className="flex h-[calc(100vh-64px)] mt-20">
        
//         {/* ICON SIDEBAR */}
//         <ChatSidebar />

//         {/* CHAT LIST */}
//         <div
//           className={`flex flex-col w-full md:w-[380px] border-r border-white/5 ${
//             activeChat ? "hidden md:flex" : "flex"
//           }`}
//         >
//           <SearchChat setActiveChat={setActiveChat} />
//           <Conversations
//             activeChat={activeChat}
//             setActiveChat={setActiveChat}
//           />
//         </div>

//         {/* CHAT BOX */}
//         <div className="flex-1 flex">
//           <ChatBox
//             activeChat={activeChat}
//             setActiveChat={setActiveChat}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Conversations from "../components/chat/Conversation";
import ChatBox from "../components/chat/ChatBox";
import SearchChat from "../components/chat/SearchChat";
import ChatSidebar from "../components/chat/ChatSidebar";
import Nav from "../components/Nav";
import { authDataContext } from "../context/AuthContext";

const ChatPage = () => {
  const { serverUrl } = useContext(authDataContext);
  const [activeChat, setActiveChat] = useState(null);
  const [conversations, setConversations] = useState([]);

  // ✅ Fetch all conversations
  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/chat`, { withCredentials: true });
      setConversations(res.data);
    } catch (err) {
      console.error("Fetch Conversations Error:", err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      {/* NAV */}
      <Nav />

      {/* BELOW NAV */}
      <div className="flex h-[calc(100vh-64px)] mt-20">
        {/* ICON SIDEBAR */}
        <ChatSidebar refreshConversations={fetchConversations} />

        {/* CHAT LIST */}
        <div
          className={`flex flex-col w-full md:w-[380px] border-r border-white/5 ${
            activeChat ? "hidden md:flex" : "flex"
          }`}
        >
          <SearchChat
            setActiveChat={setActiveChat}
            refreshConversations={fetchConversations}
          />
          <Conversations
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            conversations={conversations}
          />
        </div>

        {/* CHAT BOX */}
        <div className="flex-1 flex">
          <ChatBox
            activeChat={activeChat}
            setActiveChat={setActiveChat}
            refreshConversations={fetchConversations}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
