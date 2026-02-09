import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";
import { UserDataContext } from "../context/userContext";
import ConnectButton from "./network/connectButton";
import { FaUserCircle } from "react-icons/fa";

const SuggestedUsers = () => {
  const { serverUrl } = useContext(authDataContext);
  const { user } = useContext(UserDataContext);

  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestedUsers = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/user/suggestedusers`,
        { withCredentials: true }
      );
      setSuggestedUsers(res.data);
    } catch (error) {
      console.log("Suggested users error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  if (loading) {
    return <p className="text-gray-400 text-sm">Loading suggestions...</p>;
  }

  if (suggestedUsers.length === 0) {
    return <p className="text-gray-400 text-sm">No suggestions available</p>;
  }

  return (
    <div className="bg-[#0f172a] p-4 rounded-xl shadow-md">
      <h3 className="text-white font-semibold mb-4">
        Suggested Users
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {suggestedUsers.map((u) => (
          <div
            key={u._id}
            className="flex flex-col items-center bg-[#1e293b] p-4 rounded-lg shadow-md"
          >
            {/* Profile Pic */}
            {u.profileImage ? (
              <img
                src={
                  u.profileImage.startsWith("http")
                    ? u.profileImage
                    : `${serverUrl}/${u.profileImage}`
                }
                alt="profile"
                className="w-16 h-16 rounded-full object-cover mb-2"
              />
            ) : (
              <FaUserCircle className="text-5xl text-gray-400 mb-2" />
            )}

            {/* Name & Username */}
            <p className="text-white font-medium text-sm">{u.name}</p>
            <p className="text-gray-400 text-xs mb-3">@{u.username}</p>

            {/* Connect Button */}
            {/* {u._id !== user?._id && <ConnectButton userId={u._id} />} */}
            
 {u._id !== user?._id && (
              <ConnectButton userId={u._id} />
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
