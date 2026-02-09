// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { Trash2 } from "lucide-react";
// import { authDataContext } from "../../context/AuthContext";
// import { UserDataContext } from "../../context/userContext";

// const Conversations = ({ activeChat, setActiveChat }) => {
//   const { serverUrl } = useContext(authDataContext);
//   const { userData } = useContext(UserDataContext);

//   const [chats, setChats] = useState([]);

//   const loadChats = async () => {
//     try {
//       const res = await axios.get(`${serverUrl}/api/chat`, {
//         withCredentials: true,
//       });
//       setChats(res.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     loadChats();
//   }, []);

//   const getName = (chat) => {
//     if (chat.isGroup) return chat.name || "Group";

//     const other = chat.participants?.find(
//       (p) => String(p._id) !== String(userData?._id)
//     );

//     return other
//       ? `${other.firstname} ${other.lastname}`
//       : "User";
//   };

//   const deleteChat = async (chat) => {
//     // Group permission check
//     if (chat.isGroup && !chat.admins?.map(String).includes(String(userData?._id))) {
//       alert("You can't delete this group because you are not an admin");
//       return;
//     }

//     // Confirmation popup
//     if (!window.confirm("Are you sure you want to delete this chat?")) return;

//     try {
//       await axios.delete(`${serverUrl}/api/chat/${chat._id}`, {
//         withCredentials: true,
//       });

//       // Remove chat from local state
//       setChats((prev) => prev.filter((c) => c._id !== chat._id));

//       // Reset active chat if deleted
//       if (activeChat?._id === chat._id) setActiveChat(null);
//     } catch (err) {
//       console.log("Delete chat error:", err);
//       alert("Failed to delete chat. Please try again.");
//     }
//   };

//   return (
//     <div className="flex-1 overflow-y-auto bg-[#0b0b0b]">
//       {chats.length === 0 && (
//         <div className="h-full flex items-center justify-center text-white/40">
//           No conversations yet
//         </div>
//       )}

//       {chats.map((c) => {
//         const isActive = activeChat?._id === c._id;

//         return (
//           <div
//             key={c._id}
//             className={`flex items-center gap-3 p-4 border-b border-white/5 transition-all
//               ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}
//           >
//             {/* Avatar / Profile Image */}
//             <div className="h-11 w-11 rounded-full overflow-hidden bg-[#8b1a1a] flex items-center justify-center text-sm font-semibold text-white shadow-lg shadow-[#8b1a1a]/20">
//               {c.isGroup
//                 ? getName(c)?.charAt(0) // For groups: first letter
//                 : (() => {
//                     const other = c.participants?.find(
//                       (p) => String(p._id) !== String(userData?._id)
//                     );

//                     if (other?.profileImage) {
//                       return (
//                         <img
//                           src={other.profileImage}
//                           alt="profile"
//                           className="h-full w-full object-cover"
//                         />
//                       );
//                     }
//                     return getName(c)?.charAt(0);
//                   })()}
//             </div>

//             {/* Info */}
//             <div
//               className="flex-1 min-w-0 cursor-pointer"
//               onClick={() => setActiveChat(c)}
//             >
//               <p className="font-medium truncate">{getName(c)}</p>
//               {c.lastMessage && (
//                 <p className="text-xs text-white/40 truncate">
//                   {c.lastMessage.content}
//                 </p>
//               )}
//             </div>

//             {/* Delete Chat Button */}
//             <button
//               onClick={() => deleteChat(c)}
//               className="p-1 hover:bg-white/10 rounded transition"
//             >
//               <Trash2 size={16} className="text-red-500" />
//             </button>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Conversations;


import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Trash2, X } from "lucide-react";
import { authDataContext } from "../../context/AuthContext";
import { UserDataContext } from "../../context/userContext";

const Conversations = ({ activeChat, setActiveChat }) => {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(UserDataContext);

  const [chats, setChats] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const loadChats = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/chat`, {
        withCredentials: true,
      });
      setChats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const getName = (chat) => {
    if (chat.isGroup) return chat.name || "Group";

    const other = chat.participants?.find(
      (p) => String(p._id) !== String(userData?._id)
    );

    return other ? `${other.firstname} ${other.lastname}` : "User";
  };

  const handleDeleteClick = (chat) => {
    if (chat.isGroup && !chat.admins?.map(String).includes(String(userData?._id))) {
      setErrorMsg("You can't delete this group because you are not an admin");
      return;
    }
    setChatToDelete(chat);
    setShowDeleteModal(true);
    setErrorMsg("");
  };

  const confirmDelete = async () => {
    if (!chatToDelete) return;

    try {
      await axios.delete(`${serverUrl}/api/chat/${chatToDelete._id}`, {
        withCredentials: true,
      });
      setChats((prev) => prev.filter((c) => c._id !== chatToDelete._id));
      if (activeChat?._id === chatToDelete._id) setActiveChat(null);
    } catch (err) {
      console.log("Delete chat error:", err);
      setErrorMsg("Failed to delete chat. Try again.");
    } finally {
      setShowDeleteModal(false);
      setChatToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setChatToDelete(null);
    setErrorMsg("");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0b0b] relative">
      {chats.length === 0 && (
        <div className="h-full flex items-center justify-center text-white/40">
          No conversations yet
        </div>
      )}

      {chats.map((c) => {
        const isActive = activeChat?._id === c._id;

        return (
          <div
            key={c._id}
            className={`flex items-center gap-3 p-4 border-b border-white/5 transition-all
              ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}
          >
            {/* Avatar / Profile Image */}
            <div className="h-11 w-11 rounded-full overflow-hidden bg-[#8b1a1a] flex items-center justify-center text-sm font-semibold text-white shadow-lg shadow-[#8b1a1a]/20">
              {c.isGroup
                ? getName(c)?.charAt(0)
                : (() => {
                    const other = c.participants?.find(
                      (p) => String(p._id) !== String(userData?._id)
                    );
                    if (other?.profileImage) {
                      return (
                        <img
                          src={other.profileImage}
                          alt="profile"
                          className="h-full w-full object-cover"
                        />
                      );
                    }
                    return getName(c)?.charAt(0);
                  })()}
            </div>

            {/* Info */}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => setActiveChat(c)}
            >
              <p className="font-medium truncate">{getName(c)}</p>
              {c.lastMessage && (
                <p className="text-xs text-white/40 truncate">
                  {c.lastMessage.content}
                </p>
              )}
            </div>

            {/* Delete Chat Button */}
            <button
              onClick={() => handleDeleteClick(c)}
              className="p-1 hover:bg-white/10 rounded transition"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        );
      })}

      {/* Custom Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#121212] p-6 rounded-xl w-80 shadow-lg border border-white/10">
            <h2 className="text-white text-lg font-semibold mb-4">
              Delete Chat
            </h2>
            <p className="text-white/70 mb-6">
              Are you sure you want to delete <b>{getName(chatToDelete)}</b>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal for non-admin */}
      {errorMsg && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#121212] p-6 rounded-xl w-80 shadow-lg border border-white/10 text-center">
            <p className="text-white mb-4">{errorMsg}</p>
            <button
              onClick={() => setErrorMsg("")}
              className="px-4 py-2 rounded bg-white/10 text-white hover:bg-white/20"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conversations;
