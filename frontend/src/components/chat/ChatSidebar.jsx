import React, { useState } from "react";
import { MessageCircle, Users, Settings } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";

const ChatSidebar = ({ refreshConversations }) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);

//   return (
//     <>
//       <div className="w-16 bg-[#0a0a0a] border-r border-white/5 flex flex-col items-center py-6 gap-8">
//         {/* 1-on-1 Chat Button */}
//         <button className="p-3 rounded-xl bg-[#8b1a1a] text-white shadow-lg shadow-[#8b1a1a]/30">
//           <MessageCircle size={20} />
//         </button>

//         {/* Create Group Button */}
//         <button
//           className="p-3 rounded-xl hover:bg-white/10 text-zinc-400 transition"
//           onClick={() => setShowCreateGroup(true)}
//         >
//           <Users size={20} />
//         </button>

//         {/* Settings Button */}
//         <button className="p-3 rounded-xl hover:bg-white/10 text-zinc-400 transition mt-auto">
//           <Settings size={20} />
//         </button>
//       </div>

//       {/* Create Group Modal */}
//       {showCreateGroup && (
//         <CreateGroupModal
//           closeModal={() => setShowCreateGroup(false)}
//           refreshConversations={fetchConversation}
//         />
//       )}
//     </>
//   );
// };

  return (
    <>
      <div className="w-16 bg-[#0a0a0a] border-r border-white/5 flex flex-col items-center py-6 gap-8">
        <button className="p-3 rounded-xl bg-[#8b1a1a] text-white shadow-lg shadow-[#8b1a1a]/30">
          <MessageCircle size={20} />
        </button>

        <button
          className="p-3 rounded-xl hover:bg-white/10 text-zinc-400 transition"
          onClick={() => setShowCreateGroup(true)}
        >
          <Users size={20} />
        </button>

        <button className="p-3 rounded-xl hover:bg-white/10 text-zinc-400 transition mt-auto">
          <Settings size={20} />
        </button>
      </div>

      {showCreateGroup && (
        <CreateGroupModal
          closeModal={() => setShowCreateGroup(false)}
          refreshConversations={refreshConversations} // ✅ use the prop passed from ChatPage
        />
      )}
    </>
  );
};

export default ChatSidebar;

