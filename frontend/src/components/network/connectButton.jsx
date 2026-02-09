import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../../context/AuthContext";
import { UserDataContext } from "../../context/userContext";

const ConnectButton = ({ userId, socket }) => {
  const [status, setStatus] = useState("loading");
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(UserDataContext);

  if (userId === userData?._id) return null;

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/connections/status/${userId}`, { withCredentials: true });
      setStatus(res.data.status === "rejected" ? "none" : res.data.status);
    } catch {
      setStatus("none");
    }
  };

  useEffect(() => { fetchStatus(); }, [userId]);

  // 🔥 Real-time socket listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = (connection) => {
      if (connection.sender._id === userId && connection.receiver._id === userData?._id) setStatus("pending");
    };
    const handleAccepted = (connection) => {
      if (connection.sender._id === userId || connection.receiver._id === userId) setStatus("accepted");
    };
    const handleRemoved = ({ userId: removedUserId }) => {
      if (removedUserId === userId) setStatus("none");
    };
    const handleReset = () => setStatus("none"); // DB reset event

    socket.on("newConnectionRequest", handleNewRequest);
    socket.on("connectionAccepted", handleAccepted);
    socket.on("connectionRemoved", handleRemoved);
    socket.on("resetConnections", handleReset);

    return () => {
      socket.off("newConnectionRequest", handleNewRequest);
      socket.off("connectionAccepted", handleAccepted);
      socket.off("connectionRemoved", handleRemoved);
      socket.off("resetConnections", handleReset);
    };
  }, [socket, userId, userData?._id]);

  const sendRequest = async () => {
    if (!userId || !userData?._id) return;
    try {
      await axios.post(`${serverUrl}/api/connections/send/${userId}`, {}, { withCredentials: true });
      setStatus("pending");
    } catch (err) {
      console.error("Send request error:", err.response?.data?.message || err.message);
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  const removeConnection = async () => {
    try {
      await axios.delete(`${serverUrl}/api/connections/remove/${userId}`, { withCredentials: true });
      setStatus("none");
    } catch (err) {
      console.error("Remove connection error:", err.response?.data || err.message);
    }
  };

  if (status === "loading") return null;

  return (
    <>
      {status === "none" && (
        <button onClick={sendRequest} className="px-4 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">
          Connect
        </button>
      )}
      {status === "pending" && (
        <button disabled className="px-4 py-1 rounded-full bg-gray-300 text-gray-700 cursor-not-allowed">
          Pending
        </button>
      )}
      {status === "accepted" && (
        <button onClick={removeConnection} className="px-4 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 transition">
          Connected
        </button>
      )}
    </>
  );
};

export default ConnectButton;
