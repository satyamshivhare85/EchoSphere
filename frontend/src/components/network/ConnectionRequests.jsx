import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { authDataContext } from "../../context/AuthContext";
import { UserDataContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const ConnectionRequests = ({ socket }) => {
  const { serverUrl } = useContext(authDataContext);
  const { fetchUserById, userData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [reqRes, connRes] = await Promise.all([
        axios.get(`${serverUrl}/api/connections/requests`, { withCredentials: true }),
        axios.get(`${serverUrl}/api/connections/my`, { withCredentials: true }),
      ]);
      setRequests(reqRes.data.requests || []);
      setConnections(connRes.data.connections || []);
    } catch (err) {
      console.error("Fetch requests error:", err.response?.data || err.message);
      setRequests([]);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("newConnectionRequest", (connection) => {
      if (connection.receiver._id === userData?._id) setRequests(prev => [connection, ...prev]);
    });
    socket.on("connectionAccepted", (connection) => {
      setRequests(prev => prev.filter(req => req._id !== connection._id));
      fetchData();
    });
    socket.on("connectionRejected", ({ connectionId }) => {
      setRequests(prev => prev.filter(req => req._id !== connectionId));
    });
    socket.on("connectionRemoved", ({ userId }) => {
      setConnections(prev => prev.filter(c => c._id !== userId));
    });
    socket.on("resetConnections", () => {
      setRequests([]);
      setConnections([]);
    });

    return () => {
      socket.off("newConnectionRequest");
      socket.off("connectionAccepted");
      socket.off("connectionRejected");
      socket.off("connectionRemoved");
      socket.off("resetConnections");
    };
  }, [socket, userData?._id]);

  const accept = async (id) => {
    try {
      await axios.post(`${serverUrl}/api/connections/accept/${id}`, {}, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error("Accept error:", err.response?.data || err.message);
    }
  };

  const reject = async (id) => {
    try {
      await axios.post(`${serverUrl}/api/connections/reject/${id}`, {}, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error("Reject error:", err.response?.data || err.message);
    }
  };

  const openProfile = async (id) => {
    await fetchUserById(id);
    navigate(`/profile/${id}`);
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
        {requests.length === 0 ? <p className="text-gray-500">No pending requests</p> :
          requests.map(req => (
            <div key={req._id} className="flex items-center justify-between bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <img src={req.sender.profileImage || "/default-avatar.png"} className="w-12 h-12 rounded-full object-cover" alt="" />
                <div>
                  <p className="font-semibold">{req.sender.firstname} {req.sender.lastname}</p>
                  <p className="text-sm text-gray-500">@{req.sender.username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => accept(req._id)} className="px-4 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Accept</button>
                <button onClick={() => reject(req._id)} className="px-4 py-1.5 bg-gray-200 rounded-full hover:bg-gray-300 transition">Reject</button>
              </div>
            </div>
          ))
        }
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">My Connections</h2>
        {connections.length === 0 ? <p className="text-gray-500">No connections yet</p> :
          <div className="grid sm:grid-cols-2 gap-4">
            {connections.map(user => (
              <div key={user._id} onClick={() => openProfile(user._id)} className="flex items-center gap-4 p-4 bg-white border rounded-xl cursor-pointer hover:bg-gray-50 hover:shadow-md transition">
                <img src={user.profileImage || "/default-avatar.png"} className="w-14 h-14 rounded-full object-cover" alt="" />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{user.firstname} {user.lastname}</p>
                  <p className="text-sm text-gray-500">@{user.username}</p>
                  <p className="text-xs text-gray-400 mt-1">{user.headline}</p>
                </div>
              </div>
            ))}
          </div>
        }
      </section>
    </div>
  );
};

export default ConnectionRequests;
