import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { authDataContext } from "../../context/AuthContext";

const CreateGroupModal = ({ closeModal, refreshConversations }) => {
  const { serverUrl } = useContext(authDataContext);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Load all users to select
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user`, { withCredentials: true });
       setAllUsers(res.data.users); // ← access .users
    } catch (err) {
      console.log(err);
    }
  };
  fetchUsers();
}, []);

  const toggleUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const createGroup = async () => {
    if (!groupName || selectedUsers.length < 2) return;
    try {
      await axios.post(`${serverUrl}/api/chat/group`, {
        name: groupName,
        participants: selectedUsers,
      }, { withCredentials: true });

      refreshConversations(); // refresh conversation list
      closeModal();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#080808] p-6 rounded-lg w-96 text-white">
        <h2 className="text-lg font-semibold mb-4">Create Group</h2>
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded bg-white/10 focus:outline-none"
        />
        <div className="max-h-48 overflow-y-auto mb-3">
          {allUsers.map((user) => (
            <div key={user._id} className="flex items-center justify-between p-1">
              <span>{user.firstname} {user.lastname}</span>
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => toggleUser(user._id)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={closeModal} className="px-3 py-1 bg-gray-700 rounded">Cancel</button>
          <button onClick={createGroup} className="px-3 py-1 bg-[#8b1a1a] rounded">Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
