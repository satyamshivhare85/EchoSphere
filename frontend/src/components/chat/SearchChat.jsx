import React, { useState, useContext } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { authDataContext } from "../../context/AuthContext";

const SearchChat = ({ setActiveChat }) => {
  const { serverUrl } = useContext(authDataContext);
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  const searchUsers = async (q) => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/user/searchUser?query=${q}`,
        { withCredentials: true }
      );
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
    }
  };

  const startChat = async (userId) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/chat/access`,
        { userId },
        { withCredentials: true }
      );

      setActiveChat(res.data);
      setUsers([]);
      setQuery("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-3 border-b border-zinc-800 bg-zinc-900 mt-6">
      {/* SEARCH INPUT */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-3 text-zinc-400"
        />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) searchUsers(e.target.value);
            else setUsers([]);
          }}
          placeholder="Search users..."
          className="w-full bg-zinc-800 text-white text-sm pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-700"
        />
      </div>

      {/* RESULT LIST */}
      {users.length > 0 && (
        <div className="mt-3 bg-zinc-800 border border-zinc-700 rounded-lg max-h-60 overflow-y-auto">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => startChat(u._id)}
              className="p-3 hover:bg-zinc-700 cursor-pointer transition"
            >
              <p className="text-sm font-medium">
                {u.firstname} {u.lastname}
              </p>
              <p className="text-xs text-zinc-400">@{u.username}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchChat;

