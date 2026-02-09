import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../context/AuthContext";

const Notification = () => {
  const { serverUrl } = useContext(authDataContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${serverUrl}/api/notifications`,
        { withCredentials: true }
      );

      setNotifications(response.data); // ✅ FIX
    } catch (err) {
      console.error("Notification error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return <div className="text-white p-6">Loading notifications...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-slate-400">No notifications yet</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className="bg-[#111827] p-4 rounded-xl border border-white/10"
            >
              <p className="text-sm">
                {n.type === "connection_request" && (
                  <>👤 <b>{n.sender.firstname}</b> sent you a connection request</>
                )}

                {n.type === "connection_accepted" && (
                  <>✅ <b>{n.sender.firstname}</b> accepted your connection request</>
                )}

                {n.type === "new_post" && (
                  <>📝 <b>{n.sender.firstname}</b> shared a new post</>
                )}
              </p>

              <span className="text-xs text-slate-500">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
